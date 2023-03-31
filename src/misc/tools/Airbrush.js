import { getRandomPointWithinCircle } from '../../misc/utils';
import validateDrawArgs from './validateDrawArgs';

export default {
  latestX: null,
  latestY: null,
  cursor: 'airbrush',
  sizes: [4, 8, 16, 24],
  chosenSize: 8,
  draw({ secondaryContext, thumbnailSecondaryContext, currentPixel, currentlyPressedRef }) {
    validateDrawArgs({ secondaryContext, currentPixel, currentlyPressedRef, 
      toBeValidatedArray: ['secondaryContext', 'currentPixel', 'currentlyPressedRef']
    });
     
    this.latestX = currentPixel.x;
    this.latestY = currentPixel.y;

    const size = this.chosenSize;

    function drawRandomPoints() {
      for(let i = 0; i < size * 3; i++) {
        const { x: randX, y: randY } = getRandomPointWithinCircle(currentPixel.x, currentPixel.y, size);
        secondaryContext.fillRect(Math.round(randX), Math.round(randY), 1, 1);
        thumbnailSecondaryContext?.fillRect(Math.round(randX), Math.round(randY), 1, 1);
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
      setTimeout(timeoutCallback.bind(this), 50);
    }
    
    timeoutCallback.apply(this);
  },
};