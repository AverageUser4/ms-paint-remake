import BrushBase from "./BrushBase";
import validateToolArgs from "../validateToolArgs";

class Calligraphy_2 extends BrushBase {
  sizes = [3, 5, 8, 10];
  chosenSize = 5;

  draw({ secondaryContext, thumbnailSecondaryContext, currentPixel, colorData, currentlyPressedRef }) {
    validateToolArgs(arguments, ['secondaryContext', 'thumbnailSecondaryContext', 'currentPixel', 'colorData', 'currentlyPressedRef']);
    this._setStyle({ currentlyPressedRef, colorData, secondaryContext, thumbnailSecondaryContext });

    const size = this.chosenSize;
    let offset = Math.floor(size / 2);
    
    function drawToContext(context) {
      for(let i = 0; i < size; i++) {
        context.fillRect(currentPixel.x - offset, currentPixel.y - offset, 2, 1);
        offset--;
      }
    }

    drawToContext(secondaryContext);
    thumbnailSecondaryContext && drawToContext(thumbnailSecondaryContext);
  }
}

export default new Calligraphy_2();