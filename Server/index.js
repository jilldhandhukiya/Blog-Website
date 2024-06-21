const express = require('express');
const mongoose = require('mongoose');
const { Verify, AuthToken, UserPosts, UploadPost } = require('./controllers/index.js');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require("dotenv");
const bodyParser = require('body-parser')

dotenv.config();  // Configuration for .env File

// ENV VARIABLES
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

// Connect to Mongo Database
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch((err) => {
    console.error('Error connecting to database:', err);
    process.exit(1); // Exit the process with a failure code
  });

// Express App
const app = express();

// CORS configuration  
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
  credentials: true,
};

// Middleware
app.use(cookieParser());
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use(express.json());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));


const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads'); // Ensure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage }).single('image');


// Test route
app.get('/', (req, res) => {
  res.status(201).json({ response: 'OK' });
});

// API routes

// For Login
app.route('/api/blog/user')
  .get(AuthToken)
  .post(Verify);

  // For Edit/Upload Page 
  app.post('/api/blog/posts',upload,UploadPost)
  
  // For Home Page
  app.get('/api/blog/profile', UserPosts)

// 404 handling      
app.use((req, res) => {
  res.status(404).send('Error 404');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
