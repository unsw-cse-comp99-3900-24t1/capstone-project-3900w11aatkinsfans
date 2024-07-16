from pymongo import MongoClient

class Database:
    def __init__(self, uri='mongodb://localhost:27017/', db_name='3900'):
        self.client = MongoClient(uri)
        self.db = self.client[db_name]

    def get_collection(self, collection_name):
        return self.db[collection_name]
    
    def find_all(self, collection_name, query):
        collection = self.get_collection(collection_name)
        return collection.find(query)