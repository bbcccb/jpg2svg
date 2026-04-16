const sharp = require('sharp');
const potrace = require('potrace');
const fs = require('fs');
const path = require('path');

/**
 * Merge multiple paths into a single path for Bambu Studio compatibility
 * @param {string} svg - SVG content
 * @returns {string} SVG with single merged path
 */
function mergePathsInSVG(svg) {
  try {
    // Extract all path data attributes
    const pathRegex = /<path[^>]*d="([^"]*)"/g;
    const paths = [];
    let match;

    while ((match = pathRegex.exec(svg)) !== null) {
      const pathData = match[1].trim();
      if (pathData) {
        paths.push(pathData);
      }
    }

    // If only 0 or 1 path, return as-is
    if (paths.length <= 1) {
      return svg;
    }

    // Merge multiple paths with space separator
    const mergedPathData = paths.join(' ');

    // Extract SVG dimensions and viewBox
    const widthMatch = svg.match(/width="(\d+(?:\.\d+)?)"/);
    const heightMatch = svg.match(/height="(\d+(?:\.\d+)?)"/) ;
    const viewBoxMatch = svg.match(/viewBox="([^"]*)"/);

    const width = widthMatch ? widthMatch[1] : '1000';
    const height = heightMatch ? heightMatch[1] : '800';
    const viewBox = viewBoxMatch ? viewBoxMatch[1] : `0 0 ${width} ${height}`;

    // Create completely new, valid SVG
    const newSVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="${viewBox}">
<path fill="none" stroke="black" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="${mergedPathData}"/>
</svg>`;

    return newSVG;
  } catch (error) {
    console.error('Path merge error:', error);
    return svg;
  }
}

/**
 * Basic SVG cleanup and validation for all conversions
 * @param {string} svg - SVG content
 * @returns {string} Cleaned and validated SVG
 */
function cleanupSVG(svg) {
  try {
    let cleaned = svg;

    // Ensure XML declaration
    if (!cleaned.includes('<?xml')) {
      cleaned = '<?xml version="1.0" encoding="UTF-8"?>\n' + cleaned;
    }

    // Ensure xmlns is present
    if (!cleaned.includes('xmlns=')) {
      cleaned = cleaned.replace(
        /<svg/,
        '<svg xmlns="http://www.w3.org/2000/svg"'
      );
    }

    // Ensure xlink namespace for potential use
    if (!cleaned.includes('xmlns:xlink')) {
      cleaned = cleaned.replace(
        /<svg([^>]*?)>/,
        '<svg$1 xmlns:xlink="http://www.w3.org/1999/xlink">'
      );
    }

    // Extract dimensions
    const widthMatch = cleaned.match(/width="(\d+(?:\.\d+)?)"/);
    const heightMatch = cleaned.match(/height="(\d+(?:\.\d+)?)"/) ;

    // Ensure viewBox exists
    if (!cleaned.includes('viewBox')) {
      if (widthMatch && heightMatch) {
        const width = widthMatch[1];
        const height = heightMatch[1];
        cleaned = cleaned.replace(
          /<svg([^>]*?)>/,
          `<svg$1 viewBox="0 0 ${width} ${height}">`
        );
      }
    }

    // Remove any invalid or problematic attributes
    cleaned = cleaned.replace(/style="[^"]*"/g, '');
    cleaned = cleaned.replace(/opacity="[^"]*"/g, '');

    // Ensure proper closing
    if (!cleaned.includes('</svg>')) {
      cleaned += '\n</svg>';
    }

    return cleaned;
  } catch (error) {
    console.error('SVG cleanup error:', error);
    return svg;
  }
}

/**
 * Optimize SVG for 3D printing
 * @param {string} svg - SVG content
 * @param {object} options - Optimization options
 * @returns {string} Optimized SVG
 */
function optimizeFor3DPrint(svg, options = {}) {
  try {
    const {
      strokeWidth = 1,
      precision = 2
    } = options;

    let optimized = svg;

    // Clean first
    optimized = cleanupSVG(optimized);

    // Merge all paths into a single path for Bambu Studio compatibility
    optimized = mergePathsInSVG(optimized);

    // Update stroke width in the merged path
    optimized = optimized.replace(
      /stroke-width="[^"]*"/,
      `stroke-width="${strokeWidth}"`
    );

    // Round coordinates to reduce file size
    optimized = optimized.replace(/(\d+\.\d{3,})/g, (match) => {
      return parseFloat(match).toFixed(precision);
    });

    return optimized;
  } catch (error) {
    console.error('3D print optimization error:', error);
    return svg;
  }
}

/**
 * Convert JPG/PNG image to SVG using potrace
 * @param {string} inputPath - Path to input image
 * @param {string} outputPath - Path to output SVG
 * @param {string} mode - Conversion mode: 'normal' or '3dprint'
 * @param {object} options - Additional options
 */
async function convertJpgToSvg(inputPath, outputPath, mode = 'normal', options = {}) {
  return new Promise(async (resolve, reject) => {
    try {
      // First, convert the image to a bitmap using sharp
      const bmpPath = inputPath + '.bmp';
      
      // Get image info for better resolution
      const imageInfo = await sharp(inputPath).metadata();
      const maxDim = Math.max(imageInfo.width || 1000, imageInfo.height || 1000);
      
      // Adjust resolution based on mode for 3D printing
      const targetSize = mode === '3dprint' ? Math.min(2000, maxDim) : 1000;
      
      // Process the image: resize if needed and convert to bitmap
      await sharp(inputPath)
        .resize(targetSize, targetSize, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .greyscale() // Convert to grayscale for better tracing
        .normalise() // Enhance contrast for better tracing
        .toFile(bmpPath);

      // Potrace options - optimized for 3D printing
      const potraceOptions = mode === '3dprint' 
        ? {
            alphamax: 1.0,
            turdsize: 5,        // Higher = simpler paths (better for 3D print)
            turnpolicy: 'black', // Better for printing
            color: 'black',
            background: 'white'
          }
        : {
            alphamax: 1,
            turdsize: 2,
            turnpolicy: 'majority',
            color: 'black',
            background: 'white'
          };

      potrace.trace(bmpPath, potraceOptions, (err, svg) => {
        // Clean up temporary BMP file
        try {
          fs.unlinkSync(bmpPath);
        } catch (e) {
          console.error('Failed to delete temp BMP file:', e);
        }

        if (err) {
          reject(err);
        } else {
          // Optimize SVG
          let finalSvg = svg;
          
          // Basic cleanup for all modes - fix common SVG issues
          finalSvg = cleanupSVG(finalSvg);
          
          if (mode === '3dprint') {
            finalSvg = optimizeFor3DPrint(finalSvg, {
              removeStroke: false,
              strokeWidth: options.strokeWidth || 1,
              precision: 2
            });
          }

          // Write SVG file
          fs.writeFileSync(outputPath, finalSvg);
          resolve(outputPath);
        }
      });

    } catch (error) {
      reject(error);
    }
  });
}

module.exports = { convertJpgToSvg };
