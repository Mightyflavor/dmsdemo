const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for JWT creation
const path = require('path');

// Initialize Express
const app = express();
const port = process.env.PORT || 5000;

const cors = require('cors');
app.use(cors());

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware
app.use(bodyParser.json());

// Setup multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Save with the original name
    }
});

const upload = multer({ storage: storage });

// MongoDB connection
mongoose.connect('mongodb://localhost:27017');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to the MongoDB database');
});


// Define a schema
const docuSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    category: { type: String, required: true },
    extranotes: { type: String },
    attachment: { type: String }, // This will store the path to the uploaded file
    status: { type: String, default: 'Pending' }, // Default status set to 'Pending'
    statusHistory: [
        {
            date: { type: Date, default: Date.now },
            status: { type: String, required: true },
            timestamp: { type: Date, default: Date.now } // Automatically capture the timestamp
        }
    ],
    paymentDetails: {
        amount: { type: Number },
        paymentDate: { type: Date },
        bankName: { type: String },
        transactionId: { type: String }
    }
});

// Define a model based on the schema
const Docu = mongoose.model('Docu', docuSchema);

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    password: { type: String, required: true }
});

// Define a User model based on the schema
const User = mongoose.model('User', userSchema);

function checkemployee(){
    return (req,res,next) => {
        if (req.User.role=='Employee'){
            res.status(401)
            return res.send('Not authorized')
        }
        next()
    }

}
function checkHOD(){
    return (req,res,next) => {
        if (req.User.role=='HOD'){
            res.status(401)
            return res.send('Not authorized')
        }
        next();
    }

}
function checkAudit(){
    return (req,res,next) => {
        if (req.User.role=='Audit Department'){
            res.status(401)
            return res.send('Not authorized')
        }
        next();
    }

}

// POST request to add a new document with an attachment
app.post('/docu', upload.single('attachment'), async (req, res) => {
    const { name, description, date, category, extranotes, status } = req.body;
    const attachment = req.file ? req.file.path : null;

    // Create a new document instance
    const newDocu = new Docu({
        name,
        description,
        date,
        category,
        extranotes,
        attachment,
        status: status || 'Pending', // Use provided status or default to 'Pending'
        statusHistory: [{ status: status || 'Pending' }] // Initialize with the current status
    });

    try {
        // Save the document to the collection
        const savedDocu = await newDocu.save();
        res.status(201).json(savedDocu);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// GET request to retrieve all documents from the collection
app.get('/docu', async (req, res) => {
    try {
        const allDocuments = await Docu.find();
        res.json(allDocuments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// GET request to retrieve a single document by ID
app.get('/docu/:id',async (req, res) => {
    try {
        const document = await Docu.findById(req.params.id);
        if (document) {
            res.json(document);
        } else {
            res.status(404).json({ message: 'Document not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT request to update document status and add to status history
app.put('/docu/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const document = await Docu.findById(req.params.id);

        if (document) {
            document.status = status;
            document.statusHistory.push({ status, timestamp: new Date() });

            const updatedDocument = await document.save();
            res.json(updatedDocument);
        } else {
            res.status(404).json({ message: 'Document not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT request to process payment and update payment details
app.put('/docu/:id/payment', async (req, res) => {
    try {
        const { amount, paymentDate, bankName, transactionId } = req.body;
        const document = await Docu.findById(req.params.id);

        if (document) {
            document.paymentDetails = {
                amount,
                paymentDate,
                bankName,
                transactionId
            };

            document.status = 'Paid';
            document.statusHistory.push({ status: 'Paid', timestamp: new Date() });

            const updatedDocument = await document.save();
            res.json(updatedDocument);
        } else {
            res.status(404).json({ message: 'Document not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE request to delete a document by ID
app.delete('/docu/:id', async (req, res) => {
    try {
        const document = await Docu.findByIdAndDelete(req.params.id);
        if (document) {
            res.json({ message: 'Document deleted successfully' });
        } else {
            res.status(404).json({ message: 'Document not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET request to retrieve all documents where status is 'Pending'
app.get('/docu/status/pending', async (req, res) => {
    try {
        const documents = await Docu.find({ status: 'Pending' });
        res.json(documents);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// User Schema


// POST request to add a new user
app.post('/users', async (req, res) => {
    const { name, email, role, password } = req.body;

    // Create a new user instance
    const newUser = new User({
        name,
        email,
        role,
        password
    });

    try {
        // Save the user to the collection
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// GET request to retrieve all users
app.get('/users', async (req, res) => {
    try {
        const allUsers = await User.find();
        res.json(allUsers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET request to retrieve a single user by ID
app.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
 
// DELETE request to delete a user by ID
app.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (user) {
            res.json({ message: 'User deleted' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Create a JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyMzQ1LCJ1c2VybmFtZSI6ImpvaG5fZG9lIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzIzMzkxMzI5LCJleHAiOjE3MjMzOTQ5Mjl9.R3Llo3umxLVmnrggC7Rdy9VKbgjt_n_z2ckDepCMz-s',
             { expiresIn: '9h' });

        // Return the token and user information
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/login', async (req, res) => {
    const { email, password } = req.query;

    try {
        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the password matches (Note: In a real-world app, passwords should be hashed)
        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            {
                userId: user._id,
                username: user.name,
                role: user.role
            },
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyMzQ1LCJ1c2VybmFtZSI6ImpvaG5fZG9lIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzIzMzkxMzI5LCJleHAiOjE3MjMzOTQ5Mjl9.R3Llo3umxLVmnrggC7Rdy9VKbgjt_n_z2ckDepCMz-s', // Replace with your actual secret key
            { expiresIn: '9h' } // Token expires in 1 hour
        );

        // Return the token
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



app.get('/profile', async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

