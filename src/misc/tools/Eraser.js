import { RGBObjectToString } from "../utils";
import BrushBase from "./BrushBase";
import validateToolArgs from "./validateToolArgs";

class Eraser extends BrushBase {
  cursor = 'none';
  sizes = [4, 6, 8, 10];
  chosenSize = 8;

  _getData(currentPixel) {
    const size = this.chosenSize;
    const startX = Math.round(currentPixel.x - size / 2);
    const startY = Math.round(currentPixel.y - size / 2);

    return { size, startX, startY };
  }

  doDrawIcon({ currentPixel, colorData, brushContext, canvasZoom }) {
    validateToolArgs(arguments, ['currentPixel', 'colorData', 'brushContext', 'canvasZoom']);

    let { startX, startY, size } = this._getData(currentPixel, canvasZoom);
    
    size *= canvasZoom;
    startX *= canvasZoom;
    startY *= canvasZoom;
    startX += 0.5;
    startY += 0.5;

    brushContext.fillStyle = RGBObjectToString(colorData.secondary);
    brushContext.fillRect(startX, startY, size, size);
    brushContext.strokeStyle = 'rgb(0, 0, 0)';
    brushContext.strokeRect(startX, startY, size, size);
  }

  draw({ primaryContext, secondaryContext, thumbnailSecondaryContext, currentPixel, currentlyPressedRef, colorData }) {
    validateToolArgs(arguments, ['primaryContext', 'secondaryContext', 'thumbnailSecondaryContext', 'currentPixel', 'currentlyPressedRef', 'colorData']);

    const { startX, startY, size } = this._getData(currentPixel);
    
    if(currentlyPressedRef.current === 0) {
      const drawToContext = (context) => {
        context.fillStyle = RGBObjectToString(colorData.secondary);
        context.fillRect(startX, startY, size, size);
      };

      drawToContext(secondaryContext);
      thumbnailSecondaryContext && drawToContext(thumbnailSecondaryContext);
    } else {
      const square = primaryContext.getImageData(startX, startY, size, size);
      for(let i = 0; i < square.data.length; i += 4) {
        const sR = square.data[i];
        const sG = square.data[i + 1];
        const sB = square.data[i + 2];
        const sA = square.data[i + 3];
        const { r, g, b } = colorData.primary;

        if(sR === r && sG === g && sB === b && sA === 255) {
          const { r, g, b } = colorData.secondary;
          square.data[i] = r;
          square.data[i + 1] = g;
          square.data[i + 2] = b;
        }
      }
      secondaryContext.putImageData(square, startX, startY);
      thumbnailSecondaryContext?.putImageData(square, startX, startY);
    }
  }
}

export default new Eraser();