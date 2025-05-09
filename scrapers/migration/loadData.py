from pymongo import MongoClient
from datetime import datetime
from bson import ObjectId
import random

client = MongoClient("mongodb://localhost:27017")
db = client["CompetiTracker"]

products_col = db["products"]
history_col = db["product_history"]

# Get all products
for product in products_col.find():
    new_price = product["product_price"] 
    new_discount = product["discount"]

    # Insert into product_history
    history_col.insert_one({
        "product_id": product["_id"],
        "product_price": new_price,
        "discount": new_discount,
        "timestamp": datetime.utcnow()
    })
