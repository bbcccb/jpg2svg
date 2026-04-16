const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const { convertJpgToSvg } = require('./converter');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.static('public'));
app.use(express.json());

// Setup multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(__dirname, 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  }),
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG and PNG files are allowed'));
    }
  },
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/convert', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const inputPath = req.file.path;
    const mode = req.body.mode || 'normal'; // 'normal' or '3dprint'
    const strokeWidth = parseFloat(req.body.strokeWidth) || 1;
    const outputFileName = path.basename(inputPath, path.extname(inputPath)) + '.svg';
    const outputPath = path.join(__dirname, 'uploads', outputFileName);

    // Convert JPG to SVG with mode and options
    await convertJpgToSvg(inputPath, outputPath, mode, {
      strokeWidth: strokeWidth,
      precision: 2
    });

    // Send the converted SVG file
    res.download(outputPath, outputFileName, (err) => {
      if (err) console.error('Download error:', err);
      // Clean up files after download
      setTimeout(() => {
        try {
          fs.unlinkSync(inputPath);
          fs.unlinkSync(outputPath);
        } catch (e) {
          console.error('Cleanup error:', e);
        }
      }, 500);
    });
  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).json({ error: error.message || 'Conversion failed' });
  }
});

app.listen(PORT, () => {
  console.log(`JPG to SVG Converter running at http://localhost:${PORT}`);
});
