import validateDrawArgs from "./validateDrawArgs";

export default  {
  cursor: 'draw',
  sizes: [3, 5, 8, 10],
  chosenSizeIndex: 1,
  draw({ secondaryContext, currentPixel }) {
    validateDrawArgs({ secondaryContext, currentPixel,
      toBeValidatedArray: ['secondaryContext', 'currentPixel']
    });
    const size = this.sizes[this.chosenSizeIndex];

    if(size === 3) {
      secondaryContext.fillRect(currentPixel.x - 1, currentPixel.y + 1, 2, 1);
      secondaryContext.fillRect(currentPixel.x, currentPixel.y, 2, 1);
      secondaryContext.fillRect(currentPixel.x + 1, currentPixel.y - 1, 2, 1);
    } else if(size === 5) {
      secondaryContext.fillRect(currentPixel.x - 2, currentPixel.y + 2, 2, 1);
      secondaryContext.fillRect(currentPixel.x - 1, currentPixel.y + 1, 2, 1);
      secondaryContext.fillRect(currentPixel.x, currentPixel.y, 2, 1);
      secondaryContext.fillRect(currentPixel.x + 1, currentPixel.y - 1, 2, 1);
      secondaryContext.fillRect(currentPixel.x + 2, currentPixel.y - 2, 2, 1);
    } else if(size === 8) {
      secondaryContext.fillRect(currentPixel.x - 4, currentPixel.y + 4, 2, 1);
      secondaryContext.fillRect(currentPixel.x - 3, currentPixel.y + 3, 2, 1);
      secondaryContext.fillRect(currentPixel.x - 2, currentPixel.y + 2, 2, 1);
      secondaryContext.fillRect(currentPixel.x - 1, currentPixel.y + 1, 2, 1);
      secondaryContext.fillRect(currentPixel.x, currentPixel.y, 2, 1);
      secondaryContext.fillRect(currentPixel.x + 1, currentPixel.y - 1, 2, 1);
      secondaryContext.fillRect(currentPixel.x + 2, currentPixel.y - 2, 2, 1);
      secondaryContext.fillRect(currentPixel.x + 3, currentPixel.y - 3, 2, 1);
    } else if(size === 10) {
      secondaryContext.fillRect(currentPixel.x - 5, currentPixel.y + 5, 2, 1);
      secondaryContext.fillRect(currentPixel.x - 4, currentPixel.y + 4, 2, 1);
      secondaryContext.fillRect(currentPixel.x - 3, currentPixel.y + 3, 2, 1);
      secondaryContext.fillRect(currentPixel.x - 2, currentPixel.y + 2, 2, 1);
      secondaryContext.fillRect(currentPixel.x - 1, currentPixel.y + 1, 2, 1);
      secondaryContext.fillRect(currentPixel.x, currentPixel.y, 2, 1);
      secondaryContext.fillRect(currentPixel.x + 1, currentPixel.y - 1, 2, 1);
      secondaryContext.fillRect(currentPixel.x + 2, currentPixel.y - 2, 2, 1);
      secondaryContext.fillRect(currentPixel.x + 3, currentPixel.y - 3, 2, 1);
      secondaryContext.fillRect(currentPixel.x + 4, currentPixel.y - 4, 2, 1);
    }
  },
};