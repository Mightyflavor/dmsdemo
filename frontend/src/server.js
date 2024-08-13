const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const port = 5000;
const uri = 'mongodb+srv://admin:admin@cluster0.2bhr1.mongodb.net/doc?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(express.json());

// Connect to MongoDB once
let db;
client.connect(err => {
    if (err) {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1); // Exit if connection fails
    }
    db = client.db('doc');
    console.log('Connected to MongoDB');
});

// POST endpoint to insert a new document
app.post('/documents', async (req, res) => {
    try {
        const collection = db.collection('documents'); // Replace with your collection name
        const result = await collection.insertOne(req.body);
        res.status(201).json({ message: 'Document inserted successfully', id: result.insertedId });
    } catch (err) {
        console.error('Error inserting document:', err);
        res.status(500).json({ message: 'Error inserting document' });
    }
});

// GET endpoint to retrieve all documents (for testing)
app.get('/documents', async (req, res) => {
    try {
        const collection = db.collection('documents'); // Replace with your collection name
        const documents = await collection.find({}).toArray();
        res.status(200).json(documents);
    } catch (err) {
        console.error('Error retrieving documents:', err);
        res.status(500).json({ message: 'Error retrieving documents' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
