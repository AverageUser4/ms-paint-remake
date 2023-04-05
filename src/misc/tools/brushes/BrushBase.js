import validateToolArgs from "../validateToolArgs";
import { RGBObjectToString } from "../../utils";

class BrushBase {
  cursor = 'draw';
  sizes = [1, 3, 5, 8];
  chosenSize = 3;

  doDrawIcon({ currentPixel, canvasZoom, brushContext, currentlyPressedRef, colorData }) {
    validateToolArgs(arguments, ['currentPixel', 'canvasZoom', 'brushContext', 'currentlyPressedRef', 'colorData']);

    if(currentlyPressedRef.current !== -1) {
      return;
    }

    brushContext.fillStyle = RGBObjectToString(colorData.primary);
    brushContext.save();
    brushContext.scale(canvasZoom, canvasZoom);
    this.draw({ currentPixel, secondaryContext: brushContext });
    brushContext.restore();
  }

  draw({ secondaryContext, thumbnailSecondaryContext, currentPixel }) {
    validateToolArgs(arguments, ['secondaryContext', 'thumbnailSecondaryContext', 'currentPixel']);

    const size = this.chosenSize;

    function drawToContext(context) {
      context.beginPath();
      context.arc(currentPixel.x, currentPixel.y, size, 0, Math.PI * 2);
      context.fill();
    }

    drawToContext(secondaryContext);
    thumbnailSecondaryContext && drawToContext(thumbnailSecondaryContext);
  }
}

export default BrushBase;