from flask import Flask, jsonify
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

    # Filter for clusters of interest
    filtered_df = df[df['ClusterID'].isin([1, 2, 3, 4, 5])]

    # Initialize an empty DataFrame to store results
    results = filtered_df.copy()

    # Sort the DataFrame
    results.sort_values(by=['ClusterID', 'Timestamp'], inplace=True)
    results.drop_duplicates(subset='ClusterID', keep='first', inplace=True)  # Keep only the first row of each ClusterID

    # Combine results and quotes into final data dictionary
    data = {
        'result': results.to_dict(orient='records'),
    }

    return jsonify(data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
