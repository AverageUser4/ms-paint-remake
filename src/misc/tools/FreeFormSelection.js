import validateDrawArgs from "./validateDrawArgs";

export default {
  cursor: 'selection',
  sizes: null,
  draw({ secondaryContext, currentPixel }) {
    validateDrawArgs({ secondaryContext, currentPixel,
      toBeValidatedArray: ['secondaryContext', 'currentPixel']
    });

    const size = 2;
    secondaryContext.fillRect(currentPixel.x, currentPixel.y, size, size);
  },
};