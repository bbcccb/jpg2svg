# JPG to SVG Converter

A local, web-based JPG to SVG converter. Images are processed by a server that listens only on this computer; no third-party service is used.

## Features

- 🖼️ Upload JPG or PNG images
- 🎨 Convert dark image areas to black SVG paths on a transparent background
- 📥 Queue multiple images for sequential conversion and download each SVG
- ✏️ Optionally draw a closed outline to limit conversion to a selected image area
- 🔒 Images are sent only to the local converter and are not sent to third-party services
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

3. Open your browser to **http://127.0.0.1:3000** 🎉

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
   http://127.0.0.1:3000
   ```

3. Add one or more images:
   - Drag and drop multiple JPG/PNG files onto the upload area, or
   - Click "Browse Images" to select multiple files

4. Choose conversion mode:
   - **Normal**: Standard vector conversion
   - **3D Print (Optimized)**: Optimized for 3D printing, laser cutting, and engraving

5. Optionally click **Select area** next to an image and draw a closed outline around the part to convert. The inside is kept and the outside is ignored; without an outline, the whole image is converted.

6. Click "Convert Queue" to process the images in order. Each completed image can be downloaded immediately.

7. Click "Download SVG" next to each completed image

⚠️ **Note:** SVG is a 2D vector format. For 3D printing in applications like Bambu Studio, you'll need to convert SVG → 3D model using CAD software like Fusion 360.

## Development

To run with auto-reload on file changes (requires nodemon):

```bash
npm run dev
```

## Supported Formats

- **Input:** JPG, PNG (up to 50MB per image)
- **Output:** SVG with black traced paths and a transparent background

## Privacy

- The server listens only on `127.0.0.1`, so it is not exposed to other devices on the network.
- Images are sent from the browser to the converter running on the same computer. No analytics or third-party upload service is used.
- Uploaded and intermediate files are stored temporarily in the local `uploads` folder and cleaned up after conversion.

## How It Works

1. The image is sent to the local server running on the same computer
2. Sharp processes the image and converts it to grayscale
3. Potrace traces dark areas as black SVG paths on a transparent background
4. The SVG file is sent back to the client for download
5. Temporary files are automatically cleaned up

Batch conversions are queued in the browser and sent to the local server one image at a time. Each image can have its own optional outlined region. If an image fails, it is marked in the queue and the remaining images continue processing.

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

- Preview of SVG before download
- Support for more image formats
- Conversion history

---

Made for local image conversion
