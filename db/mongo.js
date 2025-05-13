// db/mongo.js
const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI;
console.log(uri); 
let db;

async function connectToDatabase() {
    const client = new MongoClient(uri);
    await client.connect();
    console.log("✅ Connected to MongoDB");
    db = client.db(); 
}

function getDb() {
    if (!db) {
        console.log("DB error");
        throw new Error("Database not initialized. Call connectToDatabase first.");
    }
    return db;
}

module.exports = { connectToDatabase, getDb };
