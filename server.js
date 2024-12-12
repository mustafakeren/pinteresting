const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const app = express();
const PORT = process.env.PORT || 3000;

// Cloudinary configuration
cloudinary.config({
    cloud_name: 'dcsscejrs',
    api_key: '876463429434619',
    api_secret: 'sZcHwvimqYytXnjK53PbIdNaiwo'
});

// Multer configuration to use Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads', // Cloudinary folder name
        allowed_formats: ['jpg', 'png', 'jpeg'], // Allowed file types
    },
});
const upload = multer({ storage: storage });

// Middleware
app.use(express.static('public'));

// Routes
// Upload route
app.post('/upload', upload.single('image'), (req, res) => {
    res.json({
        message: 'Image uploaded successfully!',
        fileUrl: req.file.path, // Cloudinary URL of the uploaded image
    });
});

// List images route
app.get('/list-images', async (req, res) => {
    try {
        const resources = await cloudinary.api.resources({
            type: 'upload',
            prefix: 'uploads', // Folder name in Cloudinary
        });

        const imageUrls = resources.resources.map(resource => resource.secure_url);
        res.json({ images: imageUrls });
    } catch (error) {
        console.error('Error fetching images:', error);
        res.status(500).json({ message: 'Error fetching images' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log("Server running on http://localhost:${PORT}");
});