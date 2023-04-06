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

  draw({ primaryContext, secondaryContext, thumbnailSecondaryContext, currentPixel, currentlyPressedRef, colorData, isLast, isRepeated }) {
    validateToolArgs(arguments, ['primaryContext', 'secondaryContext', 'thumbnailSecondaryContext', 'currentPixel', 'currentlyPressedRef', 'colorData', 'isLast']);

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
        const { startX: firstStartX, startY: firstStartY, endX: firstEndX, endY: firstEndY } = this._getData(this.positionData[0]);
        const { startX: lastStartX, startY: lastStartY, endX: lastEndX, endY: lastEndY } = this._getData(this.positionData[this.positionData.length - 1]);

        const min = {
          x: Math.min(firstStartX, lastStartX),
          y: Math.min(firstStartY, lastStartY),
        }
        const max = {
          x: Math.max(firstEndX, lastEndX),
          y: Math.max(firstEndY, lastEndY),
        }

        secondaryContext.fillStyle = 'green';
        secondaryContext.fillRect(min.x, min.y, max.x - min.x, max.y - min.y);
        
        for(let i = 0; i < this.positionData.length; i++) {
          secondaryContext.fillStyle = 'red'
          secondaryContext.fillRect(this.positionData[i].x, this.positionData[i].y, 1, 1);
        }

        const imageData = primaryContext.getImageData(min.x, min.y, max.x - min.x, max.y - min.y);

        for(let i = 0; i < this.positionData.length; i++) {
          const { startX, startY, endX, endY } = this._getData(this.positionData[i]);

          for(let x = startX; x < endX; x++) {
            for(let y = startY; y < endY; y++) {
              const currentX = x - min.x;
              const currentY = y - min.y;

              const currentColor = ImageDataUtils.getColorFromCoords(imageData, currentX, currentY);
              if(objectEquals(currentColor, colorData.primary, ['a'])) {
                ImageDataUtils.setColorAtCoords(imageData, currentX, currentY, colorData.secondary);
              }
            }
          }
        }

        secondaryContext.putImageData(imageData, min.x, min.y);
        thumbnailSecondaryContext?.putImageData(imageData, min.x, min.y);
      }
      
      // const square = primaryContext.getImageData(startX, startY, size, size);
      // for(let i = 0; i < square.data.length; i += 4) {
      //   const sR = square.data[i];
      //   const sG = square.data[i + 1];
      //   const sB = square.data[i + 2];
      //   const sA = square.data[i + 3];
      //   const { r, g, b } = colorData.primary;

      //   if(sR === r && sG === g && sB === b && sA === 255) {
      //     const { r, g, b } = colorData.secondary;
      //     square.data[i] = r;
      //     square.data[i + 1] = g;
      //     square.data[i + 2] = b;
      //   }
      // }
      // secondaryContext.putImageData(square, startX, startY);
      // thumbnailSecondaryContext?.putImageData(square, startX, startY);
    }
  }
}

export default new Eraser();