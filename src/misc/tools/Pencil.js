import validateDrawArgs from "./validateDrawArgs";

export default {
  cursor: 'pencil',
  sizes: [1, 2, 3, 4],
  chosenSizeIndex: 0,
  draw({ secondaryContext, currentPixel }) {
    validateDrawArgs({ secondaryContext, currentPixel,
      toBeValidatedArray: ['secondaryContext', 'currentPixel']
    });
    
    const size = this.sizes[this.chosenSizeIndex];
    
    if(size <= 2) {
      secondaryContext.fillRect(currentPixel.x, currentPixel.y, size, size);
    } else if(size === 3) {
      secondaryContext.fillRect(currentPixel.x - 1, currentPixel.y, 3, 1);
      secondaryContext.fillRect(currentPixel.x, currentPixel.y - 1, 1, 3);
    } else if(size === 4) {
      secondaryContext.fillRect(currentPixel.x - 1, currentPixel.y, 4, 2);
      secondaryContext.fillRect(currentPixel.x, currentPixel.y - 1, 2, 4);
    }
  },
};