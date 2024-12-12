const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// Set up the storage for uploaded images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir); // Create 'uploads' folder if it doesn't exist
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename with extension
  },
});

const upload = multer({ storage });

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
      imageUrl: `/uploads/${req.file.filename}` 
    });
  } else {
    res.status(400).send({ message: 'No file uploaded!' });
  }
});

// List existing images
app.get('/list-images', (req, res) => {
  const uploadDir = './uploads';
  if (!fs.existsSync(uploadDir)) {
    return res.json({ images: [] }); // Return empty list if folder doesn't exist
  }
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      return res.status(500).send({ message: 'Error reading uploads directory.' });
    }
    const imageUrls = files.map(file => `/uploads/${file}`);
    res.json({ images: imageUrls });
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
