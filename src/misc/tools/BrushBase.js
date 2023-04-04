import validateDrawArgs from "./validateDrawArgs";
import { RGBObjectToString } from "../utils";

class BrushBase {
  cursor = 'draw';
  sizes = [1, 3, 5, 8];
  chosenSize = 3;

  validate(args, toBeValidatedArray) {
    if(typeof args !== 'object') {
      console.error(`Expected to receive "arguments" object, received:`, args);
    }

    validateDrawArgs({ ...args[0], toBeValidatedArray });
  }

  doDrawIcon({ currentPixel, canvasZoom, brushContext, currentlyPressedRef, color }) {
    this.validate(arguments, ['currentPixel', 'canvasZoom', 'brushContext', 'currentlyPressedRef', 'color']);

    if(currentlyPressedRef.current !== -1) {
      return;
    }

    brushContext.fillStyle = RGBObjectToString(color.primary);
    brushContext.save();
    brushContext.scale(canvasZoom, canvasZoom);
    this.draw({ currentPixel, secondaryContext: brushContext });
    brushContext.restore();
  }

  draw({ secondaryContext, thumbnailSecondaryContext, currentPixel }) {
    this.validate(arguments, ['secondaryContext', 'thumbnailSecondaryContext', 'currentPixel']);

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