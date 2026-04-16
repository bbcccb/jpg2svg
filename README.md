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

## ⚡ Quick Start (Fastest Way)

Simply **double-click** `start.bat` in the project folder! That's it! 🎉

For detailed quick start guide, see [QUICKSTART.md](QUICKSTART.md)

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

**For Bambu Studio Users:**
⚠️ **Important:** SVG is a vector format, not a 3D model format. Bambu Studio expects `.stl`, `.obj`, or `.amf` files for 3D printing. The SVG converter produces 2D vector files that need conversion:
- **For embossing:** Use Fusion 360 or a CAD app to convert SVG → 3D model → STL
- **For 2D designs:** Use Inkscape or similar vector editor to edit/finalize SVG

See [SVG_VALIDATION_GUIDE.md](SVG_VALIDATION_GUIDE.md) and [BAMBU_STUDIO_GUIDE.md](BAMBU_STUDIO_GUIDE.md) for detailed workflows.

**Quick Start:**
1. Upload image → Select "🖨️ 3D Print (Optimized)" mode
2. Adjust stroke width for your use case
3. Convert and download
4. Import SVG into your vector editor or CAD software

📖 **Full Guides:**
- [3D_PRINTING_GUIDE.md](3D_PRINTING_GUIDE.md) - Detailed 3D printing instructions
- [BAMBU_STUDIO_GUIDE.md](BAMBU_STUDIO_GUIDE.md) - Bambu Studio integration guide
- [FUSION360_CONVERSION_GUIDE.md](FUSION360_CONVERSION_GUIDE.md) - Convert SVG to 3D model for Bambu in Fusion 360
- [SVG_VALIDATION_GUIDE.md](SVG_VALIDATION_GUIDE.md) - Validation & troubleshooting

## Usage

1. Start the server:
   - **Easiest:** Double-click `start.bat`
   - **Alternative:** Run `npm start`

2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

3. Upload an image:
   - Drag and drop an image onto the upload area, or
   - Click "Browse Files" to select an image

4. Click "Convert to SVG" button

5. Download the converted SVG file

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
├── server.js           # Express server setup
├── converter.js        # Image conversion logic
├── package.json        # Dependencies
├── public/
│   ├── index.html      # Main HTML page
│   ├── style.css       # Styling
│   └── script.js       # Frontend JavaScript
├── uploads/            # Temporary storage for files
└── README.md           # This file
```

## Limitations

- Maximum file size: 50MB
- Supported input formats: JPG, PNG
- Large images may take some time to convert
- Quality of SVG depends on the complexity and colors in the original image

## Technologies Used

- **Backend:** Node.js, Express
- **Image Processing:** Sharp, Potrace
- **Frontend:** HTML5, CSS3, Vanilla JavaScript

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
