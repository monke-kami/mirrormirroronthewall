// Client-side Pixel Avatar Generator
export class ClientPixelAvatarGenerator {
  static async generatePixelAvatar(imageFile, options = {}) {
    const {
      pixelSize = 8,
      width = 64,
      height = 64,
      colors = 16
    } = options;

    try {
      // Create canvas and load image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      return new Promise((resolve, reject) => {
        img.onload = () => {
          try {
            // Set canvas size
            canvas.width = width;
            canvas.height = height;
            
            // Draw and resize image to canvas
            ctx.drawImage(img, 0, 0, width, height);
            
            // Get image data
            const imageData = ctx.getImageData(0, 0, width, height);
            const pixels = imageData.data;
            
            // Create pixel art effect
            const pixelatedData = this.createPixelEffect(pixels, width, height, pixelSize);
            
            // Generate emoji-based pixel pattern
            const emojiPattern = this.convertToEmojiPattern(pixelatedData, width, height, pixelSize);
            
            // Create pixel avatar URL
            const pixelCanvas = this.createPixelCanvas(pixelatedData, width, height);
            const pixelAvatarUrl = pixelCanvas.toDataURL();
            
            resolve({
              pattern: emojiPattern,
              imageUrl: pixelAvatarUrl,
              originalUrl: URL.createObjectURL(imageFile),
              metadata: { width, height, pixelSize, colors },
              isReal: true
            });
          } catch (error) {
            reject(error);
          }
        };
        
        img.onerror = reject;
        img.src = URL.createObjectURL(imageFile);
      });
    } catch (error) {
      console.error('Pixel avatar generation failed:', error);
      return this.generateFallbackPixelAvatar();
    }
  }

  static createPixelEffect(pixels, width, height, pixelSize) {
    const pixelatedData = new Uint8ClampedArray(pixels.length);
    const blockSize = pixelSize;
    
    for (let y = 0; y < height; y += blockSize) {
      for (let x = 0; x < width; x += blockSize) {
        // Get average color for this block
        let totalR = 0, totalG = 0, totalB = 0, count = 0;
        
        for (let by = y; by < Math.min(y + blockSize, height); by++) {
          for (let bx = x; bx < Math.min(x + blockSize, width); bx++) {
            const index = (by * width + bx) * 4;
            totalR += pixels[index];
            totalG += pixels[index + 1];
            totalB += pixels[index + 2];
            count++;
          }
        }
        
        const avgR = Math.round(totalR / count);
        const avgG = Math.round(totalG / count);
        const avgB = Math.round(totalB / count);
        
        // Fill the block with average color
        for (let by = y; by < Math.min(y + blockSize, height); by++) {
          for (let bx = x; bx < Math.min(x + blockSize, width); bx++) {
            const index = (by * width + bx) * 4;
            pixelatedData[index] = avgR;
            pixelatedData[index + 1] = avgG;
            pixelatedData[index + 2] = avgB;
            pixelatedData[index + 3] = pixels[index + 3]; // Keep alpha
          }
        }
      }
    }
    
    return pixelatedData;
  }

  static convertToEmojiPattern(pixels, width, height, pixelSize) {
    const pattern = [];
    const blockSize = pixelSize;
    
    for (let y = 0; y < height; y += blockSize) {
      let row = '';
      for (let x = 0; x < width; x += blockSize) {
        const index = (y * width + x) * 4;
        const r = pixels[index];
        const g = pixels[index + 1];
        const b = pixels[index + 2];
        
        // Convert RGB to emoji representation
        const emoji = this.rgbToEmoji(r, g, b);
        row += emoji;
      }
      pattern.push(row);
    }
    
    return pattern;
  }

  static rgbToEmoji(r, g, b) {
    // Convert RGB values to closest emoji representation
    const brightness = (r + g + b) / 3;
    
    if (brightness < 30) return '⬛'; // Very dark
    if (brightness < 60) return '🟫'; // Dark brown/black
    if (brightness < 90) return '🟦'; // Dark blue
    if (brightness < 120) return '🟩'; // Green
    if (brightness < 150) return '🟨'; // Yellow
    if (brightness < 180) return '🟧'; // Orange
    if (brightness < 210) return '🟥'; // Red
    if (brightness < 240) return '⬜'; // Light
    return '✨'; // Very bright
  }

  static createPixelCanvas(pixels, width, height) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = width * 4; // Scale up for visibility
    canvas.height = height * 4;
    
    const imageData = new ImageData(pixels, width, height);
    
    // Create a temporary canvas with original size
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = width;
    tempCanvas.height = height;
    tempCtx.putImageData(imageData, 0, 0);
    
    // Scale up with nearest neighbor (pixelated effect)
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(tempCanvas, 0, 0, width * 4, height * 4);
    
    return canvas;
  }

  static generateFallbackPixelAvatar() {
    const fallbackPatterns = {
      smile: [
        '⬛⬛🟨🟨🟨🟨⬛⬛',
        '⬛🟨🟨🟨🟨🟨🟨⬛',
        '🟨🟨⬜⬛🟨⬛⬜🟨',
        '🟨🟨🟨🟨🟨🟨🟨🟨',
        '🟨⬛🟨🟨🟨🟨⬛🟨',
        '🟨🟨⬛⬛⬛⬛🟨🟨',
        '⬛🟨🟨🟨🟨🟨🟨⬛',
        '⬛⬛🟨🟨🟨🟨⬛⬛'
      ],
      robot: [
        '⬛⬛⬛🟦🟦⬛⬛⬛',
        '⬛🟦🟦🟦🟦🟦🟦⬛',
        '🟦🟦⬜⬛🟦⬛⬜🟦',
        '🟦🟦🟦🟦🟦🟦🟦🟦',
        '🟦⬛⬛⬛⬛⬛⬛🟦',
        '🟦🟦⬛🟦🟦⬛🟦🟦',
        '⬛🟦🟦🟦🟦🟦🟦⬛',
        '⬛⬛🟦🟦🟦🟦⬛⬛'
      ]
    };

    const pattern = fallbackPatterns.smile;
    return {
      pattern,
      isReal: false,
      isFallback: true
    };
  }
}
