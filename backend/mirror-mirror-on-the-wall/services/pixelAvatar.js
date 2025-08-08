// Pixel Avatar Generator Service
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

class PixelAvatarService {
  constructor() {
    this.avatarCache = new Map();
  }

  // Convert uploaded image to pixel art avatar
  async generatePixelAvatar(imagePath, options = {}) {
    try {
      const {
        pixelSize = 8,
        width = 128,
        height = 128,
        colors = 16
      } = options;

      console.log('Generating pixel avatar from:', imagePath);

      // Read and process the image
      const image = sharp(imagePath);
      const metadata = await image.metadata();

      // Resize to small dimensions for pixelation effect
      const smallSize = Math.floor(width / pixelSize);
      
      // Process the image to create pixel effect
      const processedBuffer = await image
        .resize(smallSize, smallSize, {
          kernel: sharp.kernel.nearest,
          fit: 'cover',
          position: 'center'
        })
        .png({ colors: colors, dither: 1.0 })
        .toBuffer();

      // Resize back up to create blocky pixel effect
      const pixelatedBuffer = await sharp(processedBuffer)
        .resize(width, height, {
          kernel: sharp.kernel.nearest
        })
        .png()
        .toBuffer();

      // Generate unique filename
      const pixelAvatarPath = path.join(
        path.dirname(imagePath),
        `pixel_${Date.now()}_${path.basename(imagePath, path.extname(imagePath))}.png`
      );

      // Save the pixel avatar
      await fs.writeFile(pixelAvatarPath, pixelatedBuffer);

      // Generate avatar variations
      const variations = await this.generateAvatarVariations(pixelatedBuffer, width, height);

      return {
        originalPath: imagePath,
        pixelPath: pixelAvatarPath,
        variations: variations,
        metadata: {
          width,
          height,
          pixelSize,
          colors,
          originalDimensions: { width: metadata.width, height: metadata.height }
        }
      };

    } catch (error) {
      console.error('Pixel avatar generation error:', error);
      throw new Error('Failed to generate pixel avatar');
    }
  }

  // Generate different style variations of the pixel avatar
  async generateAvatarVariations(baseBuffer, width, height) {
    const variations = {};

    try {
      // Mirror effect (for the "looking in mirror" feel)
      const mirroredBuffer = await sharp(baseBuffer)
        .flop() // Horizontal flip
        .png()
        .toBuffer();

      // Glitch effect
      const glitchBuffer = await this.applyGlitchEffect(baseBuffer, width, height);

      // Retro computer style
      const retroBuffer = await this.applyRetroStyle(baseBuffer, width, height);

      // Neon style
      const neonBuffer = await this.applyNeonStyle(baseBuffer, width, height);

      variations.mirrored = mirroredBuffer;
      variations.glitch = glitchBuffer;
      variations.retro = retroBuffer;
      variations.neon = neonBuffer;

      return variations;

    } catch (error) {
      console.error('Avatar variations error:', error);
      return {};
    }
  }

  // Apply glitch effect
  async applyGlitchEffect(buffer, width, height) {
    try {
      // Create RGB channel shifts for glitch effect
      const redShifted = await sharp(buffer)
        .extractChannel('red')
        .png()
        .toBuffer();

      const greenShifted = await sharp(buffer)
        .extractChannel('green')
        .png()
        .toBuffer();

      const blueShifted = await sharp(buffer)
        .extractChannel('blue')
        .png()
        .toBuffer();

      // Combine with slight offsets (simplified glitch)
      return await sharp(buffer)
        .modulate({ saturation: 1.5, brightness: 1.1 })
        .png()
        .toBuffer();

    } catch (error) {
      console.error('Glitch effect error:', error);
      return buffer;
    }
  }

  // Apply retro computer style
  async applyRetroStyle(buffer, width, height) {
    try {
      return await sharp(buffer)
        .modulate({ 
          saturation: 0.8, 
          brightness: 0.9,
          hue: 10 
        })
        .tint({ r: 255, g: 255, b: 200 }) // Slight amber tint
        .png()
        .toBuffer();

    } catch (error) {
      console.error('Retro style error:', error);
      return buffer;
    }
  }

  // Apply neon style
  async applyNeonStyle(buffer, width, height) {
    try {
      return await sharp(buffer)
        .modulate({ 
          saturation: 2.0, 
          brightness: 1.3 
        })
        .tint({ r: 255, g: 100, b: 255 }) // Neon purple tint
        .png()
        .toBuffer();

    } catch (error) {
      console.error('Neon style error:', error);
      return buffer;
    }
  }

  // Fallback pixel avatar generator (without image processing)
  generateFallbackPixelAvatar(style = 'default') {
    const pixelPatterns = {
      default: [
        '⬛⬛🟨🟨🟨🟨⬛⬛',
        '⬛🟨🟨🟨🟨🟨🟨⬛',
        '🟨🟨⬜⬛🟨⬛⬜🟨',
        '🟨🟨🟨🟨🟨🟨🟨🟨',
        '🟨⬛🟨🟨🟨🟨⬛🟨',
        '🟨🟨⬛⬛⬛⬛🟨🟨',
        '⬛🟨🟨🟨🟨🟨🟨⬛',
        '⬛⬛🟨🟨🟨🟨⬛⬛'
      ],
      mirror: [
        '⬛⬛🟦🟦🟦🟦⬛⬛',
        '⬛🟦🟦🟦🟦🟦🟦⬛',
        '🟦🟦⬜⬛🟦⬛⬜🟦',
        '🟦🟦🟦🟦🟦🟦🟦🟦',
        '🟦⬛🟦🟦🟦🟦⬛🟦',
        '🟦🟦⬛⬛⬛⬛🟦🟦',
        '⬛🟦🟦🟦🟦🟦🟦⬛',
        '⬛⬛🟦🟦🟦🟦⬛⬛'
      ],
      glitch: [
        '🟥⬛🟨🟨🟨🟦⬛🟩',
        '⬛🟨🟦🟨🟦🟨🟩⬛',
        '🟨🟦⬜⬛🟨⬛⬜🟩',
        '🟦🟨🟩🟦🟨🟩🟨🟦',
        '🟨⬛🟦🟨🟦🟨⬛🟩',
        '🟩🟨⬛⬛⬛⬛🟦🟨',
        '⬛🟦🟩🟨🟩🟦🟨⬛',
        '🟥⬛🟨🟦🟨🟦⬛🟩'
      ]
    };

    const pattern = pixelPatterns[style] || pixelPatterns.default;
    return {
      pattern: pattern,
      style: style,
      ascii: pattern.join('\n'),
      isPixelArt: true
    };
  }

  // Main method to create pixel avatar
  async createPixelAvatar(imagePath, style = 'default', options = {}) {
    try {
      // Try to process the actual image
      if (imagePath && await this.imageExists(imagePath)) {
        return await this.generatePixelAvatar(imagePath, options);
      } else {
        // Fallback to generated pixel art
        console.log('Using fallback pixel avatar generation');
        return this.generateFallbackPixelAvatar(style);
      }
    } catch (error) {
      console.error('Pixel avatar creation failed:', error);
      return this.generateFallbackPixelAvatar(style);
    }
  }

  // Check if image file exists
  async imageExists(imagePath) {
    try {
      await fs.access(imagePath);
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = new PixelAvatarService();
