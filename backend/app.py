from flask import Flask, request, jsonify
from flask_cors import CORS
from csv_to_json import get_json_data
import pandas as pd

"""
Basic Skeleton for a Flask app that you can use in a docker container.
"""

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}) 

@app.route('/test')
def test():
    data = {
        'message': 'Hello from Flask!',
        'status': 'success'
    }
    return jsonify(data)

# TODO: fetch from database in the future instead of local backend
@app.route('/dashboard/overview_data', methods=['GET'])
def get_overview_data():
    json_data = get_json_data('assets/overview_data.csv')
    return jsonify(json_data)
    
## getPopular 
@app.route('/getPopular')
def popular():
    df = pd.read_csv('sorted_clusters.csv')
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
def search():
    data = request.get_json()
    search_text = data.get('searchText')

    # Add cluster finding algorithm here.
    print(f"Received search text: {search_text}")

    # Return a response with number 1
    return jsonify({'clusterID': 1})

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
