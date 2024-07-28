from flask import Flask, request, jsonify, abort, send_from_directory
from flask_cors import CORS
import pandas as pd
import os
from sentence_transformers import SentenceTransformer
import joblib
import json
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from database.database import Database
from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration, pipeline
import time

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Setting up MongoDB connection
db = Database(uri='mongodb://localhost:27017', db_name='3900', collection_name='clusters')

# Setting up pretrained sentence transformer and PCA model
model = SentenceTransformer("all-MiniLM-L6-v2")
pca_model = joblib.load('pca_model.pkl')

# Load cluster centers from MongoDB
cluster_centers = {}
cluster_centers_data = db.find_all('cluster_centers', {})
for doc in cluster_centers_data:
    cluster_id = doc['cluster_id']
    center_vector = np.array(doc['center_vector'])
    cluster_centers[cluster_id] = center_vector

def vectorize_and_reduce(sentence, model, pca_model):
    vector_360d = model.encode(sentence)
    vector_100d = pca_model.transform([vector_360d])[0]
    return vector_100d

def find_closest_cluster_id(sentence, model, pca_model, cluster_centers):
    input_vector = vectorize_and_reduce(sentence, model, pca_model)
    min_distance = float('inf')
    closest_cluster_id = None
    for cluster_id, center_vector in cluster_centers.items():
        distance = 1 - cosine_similarity([input_vector], [center_vector])[0][0]
        if distance < min_distance:
            min_distance = distance
            closest_cluster_id = cluster_id
    return closest_cluster_id

def find_top_n_cluster_ids(sentence, model, pca_model, cluster_centers, n=10):
    input_vector = vectorize_and_reduce(sentence, model, pca_model)
    distances = []

    for cluster_id, center_vector in cluster_centers.items():
        distance = 1 - cosine_similarity([input_vector], [center_vector])[0][0]
        distances.append((cluster_id, distance))
    
    distances.sort(key=lambda x: x[1])
    top_n_clusters = distances[:n]
    top_n_cluster_ids = [cluster_id for cluster_id, _ in top_n_clusters]

    return top_n_cluster_ids

def generate_caption(model, processor, image):
    max_size = (512, 512)
    image.thumbnail(max_size, Image.ANTIALIAS)
    
    inputs = processor(images=image, return_tensors="pt")
    start_time = time.time()
    out = model.generate(**inputs)
    caption = processor.decode(out[0], skip_special_tokens=True)
    end_time = time.time()
    
    print(f"Caption generation took {end_time - start_time} seconds")
    
    return caption

@app.route('/')
def home():
    return "Welcome to the Flask API!"

@app.route('/test')
def test():
    data = {
        'message': 'Hello from Flask!',
        'status': 'success'
    }
    return jsonify(data)

@app.route('/clusters/<string:filename>', methods=['GET'])
def get_cluster(filename):
    if not os.path.isfile(f'assets/clusters/{filename}.json'):
        abort(404, description="File not found")
    return send_from_directory('assets/clusters/', f'{filename}.json')

@app.route('/getPopular')
def popular():
    df = pd.read_csv('assets/sorted_clusters.csv')
    df['Timestamp'] = pd.to_datetime(df['Timestamp'])

    earliest_timestamp = df['Timestamp'].min()
    latest_timestamp = df['Timestamp'].max()
    meme_count = df.shape[0]

    filtered_df = df[df['ClusterID'].isin([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])]

    results = filtered_df.copy()
    results.sort_values(by=['ClusterID', 'Timestamp'], inplace=True)
    results.drop_duplicates(subset='ClusterID', keep='first', inplace=True)

    data = {
        'result': results.to_dict(orient='records'),
        'earliest_timestamp': earliest_timestamp.strftime('%H:%M %d %B %Y '),
        'latest_timestamp': latest_timestamp.strftime('%H:%M %d %B %Y '),
        'memeCount': meme_count,
    }

    return jsonify(data)

@app.route('/memesearch', methods=['POST'])
def search():
    data = request.get_json()
    search_text = data.get('searchText')

    if not search_text:
        return jsonify({'error': 'searchText is required'}), 400

    closest_cluster_ids = find_top_n_cluster_ids(search_text, model, pca_model, cluster_centers)
    closest_cluster_id = find_closest_cluster_id(search_text, model, pca_model, cluster_centers)

    print(closest_cluster_ids)
    return jsonify([{'clusterID': closest_cluster_id}])

@app.route('/memepredict', methods=['POST'])
def predict():
    data = request.get_json()
    search_text = data.get('searchText')

    if not search_text:
        return jsonify({'error': 'searchText is required'}), 400

    return jsonify({'returnstuffhere': 1})

@app.route('/dashboard/overview_data_db', methods=['GET'])
def get_overview_data_db():
    data = db.find_all('overview_data', {})
    json_data = [doc for doc in data]
    return jsonify(json_data)

@app.route('/imagecaptioning', methods=['POST'])
def image_captioning():
    if 'image' not in request.files:
        return jsonify({"error": "No image file found"}), 400

    file = request.files['image']

    try:
        image = Image.open(file).convert("RGB")
        processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
        model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")
        caption = generate_caption(model, processor, image)
        return jsonify({"caption": caption}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
