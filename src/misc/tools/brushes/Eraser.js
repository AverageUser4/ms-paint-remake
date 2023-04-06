import { RGBObjectToString, ImageDataUtils, objectEquals } from "../../utils";
import BrushBase from "./BrushBase";
import validateToolArgs from "../validateToolArgs";

class Eraser extends BrushBase {
  cursor = 'none';
  sizes = [4, 6, 8, 10];
  chosenSize = 8;
  positionData = [];

  _getData(currentPixel) {
    const size = this.chosenSize;
    const startX = Math.round(currentPixel.x - size / 2);
    const startY = Math.round(currentPixel.y - size / 2);
    const endX = startX + size - 1;
    const endY = startY + size - 1;

    return { size, startX, startY, endX, endY };
  }

  doDrawIcon({ currentPixel, colorData, brushContext, canvasZoom }) {
    validateToolArgs(arguments, ['currentPixel', 'colorData', 'brushContext', 'canvasZoom']);

    let { startX, startY, size } = this._getData(currentPixel);
    
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

  draw({ secondaryContext, thumbnailSecondaryContext, currentPixel, currentlyPressedRef, colorData, isLast, isRepeated, primaryImageData }) {
    validateToolArgs(arguments, [
      'secondaryContext', 'thumbnailSecondaryContext', 'currentPixel', 'currentlyPressedRef', 'colorData', 'isLast', 'primaryImageData'
    ]);

    const { startX, startY, size } = this._getData(currentPixel);
    
    if(currentlyPressedRef.current === 0) {
      const drawToContext = (context) => {
        context.fillStyle = RGBObjectToString(colorData.secondary);
        context.fillRect(startX, startY, size, size);
      };

      drawToContext(secondaryContext);
      thumbnailSecondaryContext && drawToContext(thumbnailSecondaryContext);
    } else {
      if(!isRepeated) {
        this.positionData.length = 0;
      }
      this.positionData.push(currentPixel);

      if(isLast) {
        for(let i = 0; i < this.positionData.length; i++) {
          const { startX, startY, endX, endY } = this._getData(this.positionData[i]);

          for(let x = startX; x < endX; x++) {
            for(let y = startY; y < endY; y++) {
              if(ImageDataUtils.getIsCoordsValid(primaryImageData, x, y)) {
                const currentColor = ImageDataUtils.getColorFromCoords(primaryImageData, x, y);
                if(objectEquals(currentColor, colorData.primary, ['a'])) {
                  ImageDataUtils.setColorAtCoords(primaryImageData, x, y, colorData.secondary);
                }
              }
            }
          }
        }

        secondaryContext.putImageData(primaryImageData, 0, 0);
        thumbnailSecondaryContext?.putImageData(primaryImageData, 0, 0);
      }
    }
  }
}

export default new Eraser();