# JPG to SVG Converter

A local, web-based JPG to SVG converter application. Convert your raster images (JPG, PNG) to scalable vector graphics (SVG) directly in your browser with no cloud uploads.

## Features

- 🖼️ Upload JPG or PNG images
- 🎨 Convert to SVG vector format
- 📥 Download converted SVG files
- 🔒 All processing done locally - no data sent to external servers
- 💻 Clean, modern web interface
- 📱 Responsive design
- 🖨️ **NEW: 3D Print Mode** - Optimized SVG for 3D printing, engraving, and CAD

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

## Installation

1. Clone or navigate to the project directory:
   ```bash
   cd jpg-svg
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## ⚡ Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

3. Open your browser to **http://localhost:3000** 🎉

For detailed instructions, see [QUICKSTART.md](QUICKSTART.md)

## 🖨️ 3D Printing Mode

New feature! Convert images specifically optimized for 3D printing, engraving, and CAD applications.

**Features:**
- Path simplification for cleaner cuts/prints
- Automatic contrast enhancement
- Higher resolution (2000px) for better detail
- Adjustable stroke width (0.5-3.0mm)
- Compatible with CAD software and slicers

**Perfect for:**
- 3D printing and engraving
- Laser cutting and engraving
- CNC machining
- Relief designs
- Technical drawings

**Quick Start:**
1. Upload image → Select "🖨️ 3D Print (Optimized)" mode
2. Adjust stroke width for your use case
3. Convert and download
4. Import SVG into your vector editor or CAD software

## Usage

1. Start the server:
   ```bash
   npm start
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

3. Upload an image:
   - Drag and drop JPG/PNG onto the upload area, or
   - Click "Browse Files" to select an image

4. Choose conversion mode:
   - **Normal**: Standard vector conversion
   - **3D Print (Optimized)**: Optimized for 3D printing, laser cutting, and engraving

5. Click "Convert to SVG" button

6. Download the converted SVG file

⚠️ **Note:** SVG is a 2D vector format. For 3D printing in applications like Bambu Studio, you'll need to convert SVG → 3D model using CAD software like Fusion 360.

## Development

To run with auto-reload on file changes (requires nodemon):

```bash
npm run dev
```

## Supported Formats

- **Input:** JPG, PNG (up to 50MB)
- **Output:** SVG (Scalable Vector Graphics)

## How It Works

1. The image is uploaded to the server
2. Sharp processes the image and converts it to grayscale
3. Potrace traces the bitmap and generates SVG paths
4. The SVG file is sent back to the client for download
5. Temporary files are automatically cleaned up

## File Structure

```
jpg-svg/
├── server.js          # Express server
├── converter.js       # Image conversion logic
├── package.json       # Dependencies
├── public/
│   ├── index.html     # Frontend
│   ├── script.js      # Client-side logic
│   └── style.css      # Styling
├── README.md          # This file
└── QUICKSTART.md      # Quick start guide
```

## License

MIT

## License

MIT

## Troubleshooting

### "Port already in use"
If port 3000 is already in use, set a different port:
```bash
PORT=3001 npm start
```

### "Conversion failed"
- Ensure the image file is a valid JPG or PNG
- Check that the file is not corrupted
- Try a smaller file first

### Module not found errors
Make sure all dependencies are installed:
```bash
npm install
```

## Future Enhancements

- Batch conversion
- Adjustable conversion parameters
- Preview of SVG before download
- Support for more image formats
- Conversion history

---

Made with ❤️ for image conversion enthusiasts
