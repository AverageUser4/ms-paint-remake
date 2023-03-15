import validateDrawArgs from "./validateDrawArgs";

export default {
  cursor: 'pencil',
  sizes: [1, 2, 3, 4],
  chosenSizeIndex: 0,
  draw({ secondaryContext, thumbnailSecondaryContext, currentPixel }) {
    validateDrawArgs({ secondaryContext, currentPixel,
      toBeValidatedArray: ['secondaryContext', 'currentPixel']
    });
    
    const size = this.sizes[this.chosenSizeIndex];
    
    function drawToContext(context) {
      if(size <= 2) {
        context.fillRect(currentPixel.x, currentPixel.y, size, size);
      } else if(size === 3) {
        context.fillRect(currentPixel.x - 1, currentPixel.y, 3, 1);
        context.fillRect(currentPixel.x, currentPixel.y - 1, 1, 3);
      } else if(size === 4) {
        context.fillRect(currentPixel.x - 1, currentPixel.y, 4, 2);
        context.fillRect(currentPixel.x, currentPixel.y - 1, 2, 4);
      }
    }

    drawToContext(secondaryContext);
    thumbnailSecondaryContext && drawToContext(thumbnailSecondaryContext);
  },
};