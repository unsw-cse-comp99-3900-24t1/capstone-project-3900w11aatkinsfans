from flask import Flask, request, jsonify, abort, send_from_directory
from flask_cors import CORS
import numpy as np
from database.database import Database
import pandas as pd
import csv
import json
from sklearn.decomposition import PCA
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
import joblib

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}) 

# Setting up MongoDB connection
db = Database(uri='mongodb://localhost:27017', db_name='3900')

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

# Initial method of serving main graph data through a pre-processed excel
@app.route('/dashboard/overview_data', methods=['GET'])
def get_overview_data():
    json_data = get_json_data('assets/overview_data.csv')
    return jsonify(json_data)

# route for getting cluster_id.json given the file name
@app.route('/clusters/<string:filename>', methods=['GET'])
def get_cluster(filename):
    if not os.path.isfile(f'assets/clusters/{filename}.json'):
        abort(404, description="File not found")
    return send_from_directory('assets/clusters/', f'{filename}.json')

# getPopular 
@app.route('/getPopular')
def popular():

    df = pd.read_csv('assets/sorted_clusters.csv')
    df['Timestamp'] = pd.to_datetime(df['Timestamp'])

    earliest_timestamp = df['Timestamp'].min()
    latest_timestamp = df['Timestamp'].max()
    meme_count = df.shape[0]

    # Filter for clusters of interest
    filtered_df = df[df['ClusterID'].isin([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])]

    # Initialize an empty DataFrame to store results
    results = filtered_df.copy()

    # Sort the DataFrame
    results.sort_values(by=['ClusterID', 'Timestamp'], inplace=True)
    results.drop_duplicates(subset='ClusterID', keep='first', inplace=True)  # Keep only the first row of each ClusterID

    # Combine results and quotes into final data dictionary
    data = {
        'result': results.to_dict(orient='records'),
        'earliest_timestamp': earliest_timestamp.strftime('%H:%M %d %B %Y '),  # Format as string if needed
        'latest_timestamp': latest_timestamp.strftime('%H:%M %d %B %Y '),  # Format as string if needed
        'memeCount': meme_count,
    }

    return jsonify(data)

@app.route('/memesearch', methods=['POST'])


def vectorize_and_reduce(sentence, model, pca_model):
    vector_360d = model.encode(sentence)
    vector_100d = pca_model.transform([vector_360d])[0]
    return vector_100d

def load_cluster_centers_csv(cluster_centers_file):
    cluster_centers = {}
    with open(cluster_centers_file, 'r') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            cluster_id = int(row['cluster_id'])
            center_vector = json.loads(row['center_vector'])
            cluster_centers[cluster_id] = np.array(center_vector)
    return cluster_centers

def find_closest_cluster_id(sentence, model, pca_model, cluster_centers, clusters_dir='clusters'):
    # Vectorize the sentence and reduce dimensionality
    input_vector = vectorize_and_reduce(sentence, model, pca_model)

    # Find the closest cluster
    min_distance = float('inf')
    closest_cluster_id = None
    for cluster_id, center_vector in cluster_centers.items():
        distance = 1 - cosine_similarity([input_vector], [center_vector])[0][0]
        if distance < min_distance:
            min_distance = distance
            closest_cluster_id = cluster_id
    return closest_cluster_id

def search():
    data = request.get_json()
    search_text = data.get('searchText')

    # Add cluster finding algorithm here.
    print(f"Received search text: {search_text}")

    # Initialize the SentenceTransformer model
    model = SentenceTransformer("all-MiniLM-L6-v2")
    pca_model = joblib.load('pca_model.pkl')
    cluster_centers_file = 'cluster_centers.csv'  # Path to your cluster centers CSV file

    cluster_centers = load_cluster_centers_csv(cluster_centers_file)

    closest_cluster_id = find_closest_cluster_id(search_text, model, pca_model, cluster_centers)
    # Return a response with number 1
    return jsonify({'clusterID': closest_cluster_id})

app.route('/dashboard/overview_data_db', methods=['GET'])
def get_overview_data_db():
    data = db.find_all('overview_data', {})
    json_data = [doc for doc in data]
    return jsonify(json_data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
