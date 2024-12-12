const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const PORT = process.env.PORT || 3000;
const app = express();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Set up the storage for uploaded images
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads',
    allowed_formats:  ['jpg', 'png'],
  },
});

const upload = multer({ storage: storage });

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files
app.use(express.static(path.join(__dirname, 'public'))); // Serve static frontend files

// Serve the home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle image uploads
app.post('/upload', upload.single('image'), (req, res) => {
  if (req.file) {
    res.send({ 
      message: 'Image uploaded successfully!', 
      fileUrl: req.file.filename
    });
  } else {
    res.status(400).send({ message: 'No file uploaded!' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log('Server running on ${PORT}');
});

cloudinary.config({
  cloud_name: 'test',
  api_key: '1234',
  api_secret: '5678',
});