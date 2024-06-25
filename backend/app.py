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
def passes():
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
def passes():
    df = pd.read_csv('sorted_clusters.csv')
    filtered_df = df[df['ClusterID'].isin([1, 2, 3, 4, 5])]

    # Convert Timestamp to datetime
    df['Timestamp'] = pd.to_datetime(df['Timestamp'])

    # Group by ClusterID and resample in 30-minute intervals
    df.set_index('Timestamp', inplace=True)

    # Initialize an empty DataFrame to store results
    results = pd.DataFrame()

    for cluster_id, group in df.groupby('ClusterID'):

        # Resample each group's timestamps by 30-minute intervals and count quotes
        resampled = group['Quote'].resample('30T').count().reset_index(name='QuoteCount')
        resampled['ClusterID'] = cluster_id
        results = pd.concat([results, resampled])
    # Reset index to get a clean DataFrame
    results.reset_index(drop=True, inplace=True)

    # Sort by ClusterID and Timestamp
    results.sort_values(by=['ClusterID', 'Timestamp'], inplace=True)

    # Get the total count of quotes for each ClusterID

    filtered_df = df[df['ClusterID'].isin([1, 2, 3, 4, 5])]
    quotes = filtered_df.groupby('ClusterID').first().reset_index()
    sampled = results[results['ClusterID'].isin([1, 2, 3, 4, 5])]

    data = {
        'quotes': quotes,
        'timeseries': sampled,
    }
    return jsonify(data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
