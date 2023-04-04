import { ImageDataUtils, RGBObjectToString } from "../utils";
import BrushBase from "./BrushBase";
import validateToolArgs from "./validateToolArgs";

class FreeFormSelection extends BrushBase {
  cursor = 'selection';
  sizes = null;
  chosenSize = null;

  doDrawIcon() {}

  draw({ secondaryContext, thumbnailSecondaryContext, currentPixel, primaryImageData }) {
    validateToolArgs(arguments, ['secondaryContext', 'thumbnailSecondaryContext', 'currentPixel', 'primaryImageData']);
  
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
  
      function drawToContext(context) {
        context.fillStyle = RGBObjectToString(invertedColor);
        context.fillRect(x, y, 1, 1);
      }
  
      drawToContext(secondaryContext);
      thumbnailSecondaryContext && drawToContext(thumbnailSecondaryContext);
    }
  
    drawAtCoords(currentPixel.x, currentPixel.y);
    drawAtCoords(currentPixel.x + 1, currentPixel.y);
    drawAtCoords(currentPixel.x, currentPixel.y + 1);
    drawAtCoords(currentPixel.x + 1, currentPixel.y + 1);
  }
}

export default new FreeFormSelection();