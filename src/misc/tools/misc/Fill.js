import { objectEquals } from "../../utils";
import { ImageDataUtils } from "../../utils";
import validateToolArgs from "../validateToolArgs";

export default {
  cursor: 'fill',
  sizes: null,

  onPointerDown({ event, primaryContext, thumbnailPrimaryContext, canvasSize, canvasZoom, colorData }) {
    validateToolArgs(arguments, ['event', 'primaryContext', 'thumbnailPrimaryContext', 'canvasSize', 'canvasZoom', 'colorData']);
    
    const { width, height } = canvasSize;
    let { offsetX, offsetY } = event.nativeEvent;
    offsetX = Math.round(offsetX / canvasZoom);
    offsetY = Math.round(offsetY / canvasZoom);
    const imageData = primaryContext.getImageData(0, 0, width, height);
    const fillColor = event.button === 0 ? colorData.primary : colorData.secondary;
    const clickedColor = ImageDataUtils.getColorFromCoords(imageData, offsetX, offsetY);

    if(objectEquals(fillColor, clickedColor, ['a'])) {
      return;
    }

    /* http://www.williammalone.com/articles/html5-canvas-javascript-paint-bucket-tool/ */
    const pixelStack = [[offsetX, offsetY]];

    function matchStartColor(pixelPos) {
      const r = imageData.data[pixelPos];	
      const g = imageData.data[pixelPos + 1];	
      const b = imageData.data[pixelPos + 2];

      return (r == clickedColor.r && g == clickedColor.g && b == clickedColor.b);
    }

    function colorPixel(pixelPos) {
      imageData.data[pixelPos] = fillColor.r;
      imageData.data[pixelPos + 1] = fillColor.g;
      imageData.data[pixelPos + 2] = fillColor.b;
      imageData.data[pixelPos + 3] = 255;
    }

    while(pixelStack.length) {
      let reachLeft = false;
      let reachRight = false;
      const newPos = pixelStack.pop();
      let x = newPos[0];
      let y = newPos[1];
      let pixelPos = (y * canvasSize.width + x) * 4;

      while(y-- > 0 && matchStartColor(pixelPos)) {
        pixelPos -= canvasSize.width * 4;
      }

      pixelPos += canvasSize.width * 4;
      y++;
      reachLeft = false;
      reachRight = false;

      while(y++ < canvasSize.height-1 && matchStartColor(pixelPos)) {
        colorPixel(pixelPos);

        if(x > 0) {
          if(matchStartColor(pixelPos - 4)) {
            if(!reachLeft) {
              pixelStack.push([x - 1, y]);
              reachLeft = true;
            }
          } else if(reachLeft) {
            reachLeft = false;
          }
        }
      
        if(x < canvasSize.width - 1) {
          if(matchStartColor(pixelPos + 4)) {
            if(!reachRight) {
              pixelStack.push([x + 1, y]);
              reachRight = true;
            }
          }
          else if(reachRight) {
            reachRight = false;
          }
        }
          
        pixelPos += canvasSize.width * 4;
      }
    }

    primaryContext.putImageData(imageData, 0, 0);
    thumbnailPrimaryContext && thumbnailPrimaryContext.putImageData(imageData, 0, 0);
  },

  onPointerMove() {
    return;
  }
  
};