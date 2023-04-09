import validateToolArgs from "../validateToolArgs";
import { RGBObjectToString } from "../../utils";

class BrushBase {
  cursor = 'draw';
  sizes = [1, 3, 5, 8];
  chosenSize = 3;

  _setStyle({ currentlyPressedRef, colorData, secondaryContext, thumbnailSecondaryContext, opacity = 1 }) {
    const usedPrimary = { ...colorData.primary };
    const usedSecondary = { ...colorData.secondary };
    usedPrimary.a = opacity;
    usedSecondary.a = opacity;

    function setStyleOfContext(context) {
      context.fillStyle = currentlyPressedRef.current === 2 ? RGBObjectToString(usedSecondary) : RGBObjectToString(usedPrimary);
      context.strokeStyle = currentlyPressedRef.current === 2 ? RGBObjectToString(usedSecondary) : RGBObjectToString(usedPrimary);
    }
  
    setStyleOfContext(secondaryContext);
    thumbnailSecondaryContext && setStyleOfContext(thumbnailSecondaryContext);
  }

  doDrawIcon({ currentPixel, brushContext, currentlyPressedRef, colorData }) {
    validateToolArgs(arguments, ['currentPixel', 'brushContext', 'currentlyPressedRef', 'colorData']);

    if(currentlyPressedRef.current !== -1) {
      return;
    }

    brushContext.save();
    brushContext.fillStyle = RGBObjectToString(colorData.primary);
    brushContext.imageSmoothingEnabled = false;    
    this.draw({ 
      currentPixel,
      secondaryContext: brushContext,
      colorData,
      currentlyPressedRef,
      isInvokedByDoDrawIcon: true
    });
    brushContext.restore();
  }

  draw({ secondaryContext, thumbnailSecondaryContext, currentPixel, colorData, currentlyPressedRef }) {
    validateToolArgs(arguments, ['secondaryContext', 'thumbnailSecondaryContext', 'currentPixel', 'colorData', 'currentlyPressedRef']);
    this._setStyle({ currentlyPressedRef, colorData, secondaryContext, thumbnailSecondaryContext });

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