import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

// Optimize image after upload - accepts buffer from multer
export async function optimizeUploadedImage(uploadedPath: string): Promise<string> {
  try {
    // Read the original file as a buffer
    const buffer = await fs.promises.readFile(uploadedPath);

    // Optimizations for JPEG images
    if (path.extname(uploadedPath).toLowerCase() === '.jpg' || path.extname(uploadedPath).toLowerCase() === '.jpeg') {
      const optimizedBuffer = sharp(buffer)
        .jpeg({
          quality: 85, // JPEG quality (1-100)
          progressive: true, // Progressive encoding for better perceived load time
          mozjpeg: true, // Use mozjpeg for better compression
          chroma444: false,
          useToc: false,
        })
        .toBuffer();

      // Create filename with optimized suffix
      const ext = path.extname(uploadedPath);
      const baseName = path.basename(uploadedPath, ext) + '.optimized' + ext;
      const outputPath = path.join(path.dirname(uploadedPath), baseName);

      await fs.promises.writeFile(outputPath, optimizedBuffer);

      // Optionally delete original after optimization (uncomment if needed)
      // await fs.promises.unlink(uploadedPath);

      return outputPath;
    }

    // For PNG images - convert to progressive PNG
    else if (path.extname(uploadedPath).toLowerCase() === '.png') {
      const optimizedBuffer = sharp(buffer, { failOnError: false })
        .png({
          compressionLevel: 6, // Compression level (0-9)
          chromaSubsampling: '4:2:0',
          progressive: true, // Progressive PNG encoding
          depth: 8,
          palette: false, // Keep color depth as-is
        })
        .toBuffer();

      const ext = path.extname(uploadedPath);
      const baseName = path.basename(uploadedPath, ext) + '.optimized' + ext;
      const outputPath = path.join(path.dirname(uploadedPath), baseName);

      await fs.promises.writeFile(outputPath, optimizedBuffer);

      // Optionally delete original (uncomment if needed)
      // await fs.promises.unlink(uploadedPath);

      return outputPath;
    } else {
      // For other formats or WebP
      const optimizedBuffer = sharp(buffer)
        .png({
          compressionLevel: 6,
          progressive: true,
        })
        .toBuffer();

      const ext = path.extname(uploadedPath);
      const baseName = path.basename(uploadedPath, ext) + '.optimized' + ext;
      const outputPath = path.join(path.dirname(uploadedPath), baseName);

      await fs.promises.writeFile(outputPath, optimizedBuffer);

      return outputPath;
    }
  } catch (error) {
    console.error(`Failed to optimize image: ${error}`);
    throw error; // Re-throw so middleware can handle the error
  }
}

// Optimize uploaded image and replace original
export async function optimizeAndReplaceImage(uploadedPath: string): Promise<string> {
  try {
    const buffer = await fs.promises.readFile(uploadedPath);

    const optimizedBuffer = sharp(buffer, { failOnError: false })
      .jpeg({
        quality: 85,
        progressive: true,
        mozjpeg: true,
        chroma444: false,
      })
      .toBuffer();

    // Replace original with optimized version
    await fs.promises.writeFile(uploadedPath, optimizedBuffer);

    return uploadedPath;
  } catch (error) {
    console.error(`Failed to optimize and replace image: ${error}`);
    throw error;
  }
}
