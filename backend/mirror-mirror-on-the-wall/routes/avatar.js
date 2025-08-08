const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const pixelAvatarService = require('../services/pixelAvatar');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/avatars/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Upload avatar and generate pixel version
router.post('/upload', upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('Processing uploaded avatar:', req.file.path);

    // Generate pixel avatar
    const pixelResult = await pixelAvatarService.createPixelAvatar(
      req.file.path, 
      'default',
      { pixelSize: 8, width: 128, height: 128, colors: 16 }
    );

    const avatarData = {
      id: Date.now(),
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      uploadedAt: new Date(),
      processed: true,
      pixelAvatar: pixelResult
    };

    res.json({
      message: 'Avatar uploaded and pixelated successfully',
      avatar: avatarData
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Failed to upload avatar' });
  }
});

// Process avatar (simulate deepfake generation)
router.post('/process/:avatarId', async (req, res) => {
  try {
    const { avatarId } = req.params;
    const { style } = req.body; // 'zen', 'angry', 'condescending', etc.
    
    // Simulate processing time
    setTimeout(() => {
      const processedAvatar = {
        id: avatarId,
        style: style || 'default',
        videoUrl: `/api/avatars/videos/${avatarId}-${style || 'default'}.mp4`,
        processed: true,
        processedAt: new Date()
      };
      
      // In real implementation, this would trigger deepfake generation
      res.json({
        message: 'Avatar processing completed',
        avatar: processedAvatar
      });
    }, 2000);
  } catch (error) {
    console.error('Processing error:', error);
    res.status(500).json({ message: 'Failed to process avatar' });
  }
});

// Get avatar styles
router.get('/styles', (req, res) => {
  const styles = [
    {
      id: 'zen',
      name: 'Zen You',
      description: 'Calm, but passive-aggressive',
      icon: '🧘‍♀️'
    },
    {
      id: 'angry',
      name: 'Angry You',
      description: 'Tough love, emphasis on tough',
      icon: '😤'
    },
    {
      id: 'condescending',
      name: 'Condescending You',
      description: 'Superior attitude, obvious solutions',
      icon: '🤓'
    },
    {
      id: 'chaotic',
      name: 'Chaotic You',
      description: 'Unhinged advice, questionable wisdom',
      icon: '🤪'
    }
  ];
  
  res.json(styles);
});

module.exports = router;
