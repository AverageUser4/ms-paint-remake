import { RGBObjectToString } from "../utils";
import validateDrawArgs from "./validateDrawArgs";

export default {
  cursor: 'none',
  sizes: [4, 6, 8, 10],
  chosenSizeIndex: 2,
  draw({ primaryContext, secondaryContext, currentPixel, currentlyPressedRef, color }) {
    validateDrawArgs({ primaryContext, secondaryContext, currentPixel, currentlyPressedRef, color,
      toBeValidatedArray: ['primaryContext', 'secondaryContext', 'currentPixel', 'currentlyPressedRef', 'color']
    });

    const size = this.sizes[this.chosenSizeIndex];
    const startX = currentPixel.x - size / 2;
    const startY = currentPixel.y - size / 2;

    if(currentlyPressedRef.current === 0) {
      secondaryContext.fillStyle = RGBObjectToString(color.secondary);
      secondaryContext.fillRect(startX, startY, size, size);
    } else {
      const square = primaryContext.getImageData(startX, startY, size, size);
      for(let i = 0; i < square.data.length; i += 4) {
        const sR = square.data[i];
        const sG = square.data[i + 1];
        const sB = square.data[i + 2];
        const sA = square.data[i + 3];
        const { r, g, b } = color.primary;

        if(sR === r && sG === g && sB === b && sA === 255) {
          const { r, g, b } = color.secondary;
          square.data[i] = r;
          square.data[i + 1] = g;
          square.data[i + 2] = b;
        }
      }
      secondaryContext.putImageData(square, startX, startY);
    }
  },
};