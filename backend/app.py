from flask import Flask, request, jsonify, abort
from flask_cors import CORS
from sentence_transformers import SentenceTransformer
import joblib
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from database.database import Database
from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration
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
clusters_data = db.find_all('clusters', {})
for cluster in clusters_data:
    cluster_id = cluster['cluster_id']
    center_vector = cluster['popularityCurve']['data']  # Assuming this is the center vector
    cluster_centers[cluster_id] = np.array(center_vector)

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

def generate_caption(model, processor, image):
    # Open the image
    
    # Resize image to a reasonable size
    max_size = (512, 512)
    image.thumbnail(max_size, Image.ANTIALIAS)
    
    # Preprocess the image
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

# route for getting cluster data given the cluster_id
@app.route('/clusters/<int:cluster_id>', methods=['GET'])
def get_cluster(cluster_id):
    cluster_data = db.find_all('clusters', {'cluster_id': cluster_id})
    cluster_list = list(cluster_data)
    if cluster_list:
        return jsonify(cluster_list[0])  # Assuming there's only one document per cluster_id
    else:
        return jsonify({'error': 'Cluster not found'}), 404
    
# getPopular 
@app.route('/getPopular')
def popular():
    clusters_data_cursor = db.find_all('clusters', {})
    clusters_data = list(clusters_data_cursor)
    result_data = []
    x_labels = []

    for cluster in clusters_data:
        if 'popularityCurve' in cluster and 'xLabels' in cluster['popularityCurve']:
            x_labels.extend(cluster['popularityCurve']['xLabels'])
        result_data.append({
            'cluster_id': cluster['cluster_id'],
            'popularityCurve': cluster['popularityCurve'],
            'clusterList': cluster['clusterList']
        })

    # Extract the earliest and latest timestamps
    if x_labels:
        earliest_timestamp = min(x_labels)
        latest_timestamp = max(x_labels)
    else:
        earliest_timestamp = latest_timestamp = None

    meme_count = len(clusters_data)

    data = {
        'result': result_data,
        'earliest_timestamp': earliest_timestamp,
        'latest_timestamp': latest_timestamp,
        'memeCount': meme_count,
    }

    return jsonify(data)


@app.route('/memesearch', methods=['POST'])
def search():
    data = request.get_json()
    search_text = data.get('searchText')

    if not search_text:
        return jsonify({'error': 'searchText is required'}), 400

    # Find the closest cluster ID for the given search text
    closest_cluster_id = find_closest_cluster_id(search_text, model, pca_model, cluster_centers)

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
