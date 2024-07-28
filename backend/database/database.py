import os
import json
from pymongo import MongoClient

class Database:
    def __init__(self, uri='mongodb://localhost:27017/', db_name='3900', collection_name='clusters'):
        self.client = MongoClient(uri)
        self.db = self.client[db_name]
        self.collection = self.db[collection_name]

    def get_collection(self, collection_name):
        return self.db[collection_name]
    
    def find_all(self, collection_name, query):
        collection = self.get_collection(collection_name)
        return collection.find(query)

    def find_one(self, collection_name, query):
        collection = self.get_collection(collection_name)
        return collection.find_one(query)

    def insert_json_files(self, directory):
        files = [f for f in os.listdir(directory) if f.startswith('cluster_') and f.endswith('.json')]
        for file in files:
            with open(os.path.join(directory, file), 'r') as f:
                data = json.load(f)
                cluster_id = int(file.split('_')[1].split('.')[0])  # cluster_id
                data['cluster_id'] = cluster_id
                self.collection.insert_one(data)

if __name__ == "__main__":
    db = Database()
    db.insert_json_files('/home/cheny/24T2/3900/capstone-project-3900w11aatkinsfans/backend/assets/clusters')
