import validateDrawArgs from "./validateDrawArgs";
import { ImageDataUtils, RGBObjectToString } from "../utils";

export default {
  cursor: 'selection',
  sizes: null,
  draw({ primaryContext, secondaryContext, currentPixel, primaryImageData }) {
    validateDrawArgs({ primaryContext, secondaryContext, currentPixel, primaryImageData,
      toBeValidatedArray: ['primaryContext', 'secondaryContext', 'currentPixel', 'primaryImageData']
    });

    const drawAtCoords = (x, y) => {
      if(x > primaryImageData.width - 1 || y > primaryImageData.height - 1) {
        return;
      }
      
      let color = ImageDataUtils.getColorFromCoords(primaryImageData, x, y);
      let invertedColor = { r: 255 - color.r, g: 255 - color.g, b: 255 - color.b };
      if(
          Math.abs(invertedColor.r - color.r) < 20 && 
          Math.abs(invertedColor.g - color.g) < 20 &&
          Math.abs(invertedColor.b - color.b) < 20
        ) {
          invertedColor = { r: 255, g: 255, b: 255 };
      }

      secondaryContext.fillStyle = RGBObjectToString(invertedColor);
      secondaryContext.fillRect(x, y, 1, 1);
    }

    drawAtCoords(currentPixel.x, currentPixel.y);
    drawAtCoords(currentPixel.x + 1, currentPixel.y);
    drawAtCoords(currentPixel.x, currentPixel.y + 1);
    drawAtCoords(currentPixel.x + 1, currentPixel.y + 1);

  },
};