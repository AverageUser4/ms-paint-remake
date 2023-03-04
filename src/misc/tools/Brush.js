import validateDrawArgs from "./validateDrawArgs";

export default {
  cursor: 'draw',
  sizes: [1, 3, 5, 8],
  chosenSizeIndex: 1,
  draw({ secondaryContext, currentPixel }) {
    validateDrawArgs({ secondaryContext, currentPixel,
      toBeValidatedArray: ['secondaryContext', 'currentPixel']
    });

    const size = this.sizes[this.chosenSizeIndex];

    secondaryContext.beginPath();
    secondaryContext.arc(currentPixel.x, currentPixel.y, size, 0, Math.PI * 2);
    secondaryContext.fill();
  },
};