import { getRandomPointWithinCircle } from '../../misc/utils';
import validateDrawArgs from './validateDrawArgs';

export default {
  latestX: null,
  latestY: null,
  cursor: 'draw',
  sizes: [4, 8, 16, 24],
  chosenSizeIndex: 1,
  draw({ secondaryContext, currentPixel, currentlyPressedRef }) {
    validateDrawArgs({ secondaryContext, currentPixel, currentlyPressedRef, 
      toBeValidatedArray: ['secondaryContext', 'currentPixel', 'currentlyPressedRef']
    });
     
    const size = this.sizes[this.chosenSizeIndex];
    this.latestX = currentPixel.x;
    this.latestY = currentPixel.y;

    function drawRandomPoints() {
      for(let i = 0; i < size; i++) {
        const { x: randX, y: randY } = getRandomPointWithinCircle(currentPixel.x, currentPixel.y, size);
        secondaryContext.fillRect(Math.round(randX), Math.round(randY), 1, 1);
      }
    }

    function timeoutCallback() {
      if(
          currentlyPressedRef.current === -1 ||
          currentPixel.x !== this.latestX ||
          currentPixel.y !== this.latestY
        ) {
        return;
      }

      drawRandomPoints();
      setTimeout(timeoutCallback.bind(this), 100);
    }
    
    timeoutCallback.apply(this);
  },
};