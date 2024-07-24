import csv
import os
import json
from pymongo import MongoClient

class Database:
    def __init__(self, uri='mongodb://localhost:27017/', db_name='3900', collection_name='clusters'):
        self.client = MongoClient(uri)
        self.db = self.client[db_name]
        self.collection_name = collection_name

    def get_collection(self):
        # Retrieve the collection object from the database
        return self.db[self.collection_name]
    
    def find_all(self, query):
        # Find all documents in the collection that match the given query
        collection = self.get_collection()
        return collection.find(query)
    
    def insert_csv(self, csv_file_path):
        # Insert data from a CSV file into the collection
        collection = self.get_collection()
        with open(csv_file_path, newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                collection.insert_one(row)
    
    def insert_json_files(self, json_directory):
        # Insert data from all JSON files in the specified directory into the collection
        collection = self.get_collection()
        for filename in os.listdir(json_directory):
            if filename.endswith('.json'):
                file_path = os.path.join(json_directory, filename)
                with open(file_path, 'r', encoding='utf-8') as file:
                    data = json.load(file)
                    if isinstance(data, list):
                        collection.insert_many(data)
                    else:
                        collection.insert_one(data)
                print(f"Successfully imported {filename}")

if __name__ == "__main__":
    db = Database(collection_name='clusters')
    # Insert data from all JSON files in the 'clusters' directory into the 'clusters' collection
    db.insert_json_files('/home/cheny/24T2/3900/capstone-project-3900w11aatkinsfans/backend/assets/clusters')
