import validateDrawArgs from "./validateDrawArgs";
import { RGBObjectToString } from "../utils";

export default  {
  cursor: 'draw',
  sizes: [3, 5, 8, 10],
  chosenSize: 5,

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
    let offset = Math.floor(size / 2);

    function drawToContext(context) {
      for(let i = 0; i < size; i++) {
        context.fillRect(currentPixel.x - offset, currentPixel.y + offset, 2, 1);
        offset--;
      }
    }

    drawToContext(secondaryContext);
    thumbnailSecondaryContext && drawToContext(thumbnailSecondaryContext);
  },
};