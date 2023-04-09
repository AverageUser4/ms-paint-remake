import BrushBase from "./BrushBase";
import validateToolArgs from "../validateToolArgs";

class Pencil extends BrushBase {
  cursor = 'pencil';
  sizes = [1, 2, 3, 4];
  chosenSize = 1;

  doDrawIcon() {}

  draw({ secondaryContext, thumbnailSecondaryContext, currentPixel, colorData, currentlyPressedRef }) {
    validateToolArgs(arguments, ['secondaryContext', 'thumbnailSecondaryContext', 'currentPixel', 'colorData', 'currentlyPressedRef']);
    this._setStyle({ currentlyPressedRef, colorData, secondaryContext, thumbnailSecondaryContext });

    const size = this.chosenSize;
    
    function drawToContext(context) {
      if(size <= 2) {
        context.fillRect(currentPixel.x, currentPixel.y, size, size);
      } else if(size === 3) {
        context.fillRect(currentPixel.x - 1, currentPixel.y, 3, 1);
        context.fillRect(currentPixel.x, currentPixel.y - 1, 1, 3);
      } else if(size === 4) {
        context.fillRect(currentPixel.x - 1, currentPixel.y, 4, 2);
        context.fillRect(currentPixel.x, currentPixel.y - 1, 2, 4);
      } else {
        context.beginPath();
        context.arc(currentPixel.x, currentPixel.y, size, 0, Math.PI * 2);
        context.fill();
      }
    }

    drawToContext(secondaryContext);
    thumbnailSecondaryContext && drawToContext(thumbnailSecondaryContext);
  }
}

export default new Pencil();