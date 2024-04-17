const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const cors = require('cors');

const app = express();

// Apply CORS globally to all routes
app.use(cors());
const port = 3000;

// Middleware
app.use(bodyParser.json());

// MongoDB Connection URL
const mongoURL = 'mongodb://localhost:27017';
const dbName = 'practice';
const collectionName = 'TP';

// GET route to fetch data from MongoDB collection
app.get('/machine-data', async (req, res) => {
    try {
        // Connect to MongoDB
        const client = new MongoClient(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();

        // Access database and collection
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Fetch data from collection
        const data = await collection.find({}).toArray();

        // Close connection
        client.close();

        // Send response with data
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
