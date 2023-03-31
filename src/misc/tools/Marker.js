import validateDrawArgs from "./validateDrawArgs";
import { RGBObjectToString } from "../utils";

export default {
  cursor: 'draw',
  sizes: [8, 16, 30, 40],
  chosenSize: 16,

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
    console.error('TODO: add unique implementation.');
    
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