import { RGBObjectToString } from "../utils";
import validateDrawArgs from "./validateDrawArgs";

export default {
  cursor: 'draw',
  sizes: [1, 3, 5, 8],
  chosenSize: 3,

  doDrawIcon({ currentPixel, canvasZoom, brushContext, currentlyPressedRef, color }) {
    validateDrawArgs({ canvasZoom, brushContext, currentlyPressedRef, color,
      toBeValidatedArray: ['canvasZoom', 'brushContext', 'currentlyPressedRef', 'color']
    });

    if(currentlyPressedRef.current !== -1) {
      return;
    }

    brushContext.fillStyle = RGBObjectToString(color.primary);
    brushContext.save();
    brushContext.scale(canvasZoom, canvasZoom);
    this.draw({ currentPixel, secondaryContext: brushContext });
    brushContext.restore();
  },

  draw({ secondaryContext, thumbnailSecondaryContext, currentPixel }) {
    validateDrawArgs({ secondaryContext, currentPixel, 
      toBeValidatedArray: ['secondaryContext', 'currentPixel']
    });

    const size = this.chosenSize;

    function drawToContext(context) {
      context.beginPath();
      context.arc(currentPixel.x, currentPixel.y, size, 0, Math.PI * 2);
      context.fill();
    }

    drawToContext(secondaryContext);
    thumbnailSecondaryContext && drawToContext(thumbnailSecondaryContext);
  },
};