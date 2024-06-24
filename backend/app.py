from flask import Flask, jsonify
from flask_cors import CORS
from csv_to_json import get_json_data

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
    

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
