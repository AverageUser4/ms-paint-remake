import BrushBase from "./BrushBase";
import validateToolArgs from "../validateToolArgs";

class Marker extends BrushBase {
  sizes = [8, 16, 30, 40];
  chosenSize = 16;

  draw({ secondaryContext, thumbnailSecondaryContext, currentPixel, colorData, currentlyPressedRef, isInvokedByDoDrawIcon }) {
    /* 
      it seems like in paint it is implemented the same way as brushes using textures are
    */
    
    validateToolArgs(arguments, ['secondaryContext', 'thumbnailSecondaryContext', 'currentPixel', 'colorData', 'currentlyPressedRef']);
    this._setStyle({ currentlyPressedRef, colorData, secondaryContext, thumbnailSecondaryContext, opacity: isInvokedByDoDrawIcon ? 0.75 : 0.035 });

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

export default new Marker();