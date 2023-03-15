import validateDrawArgs from "./validateDrawArgs";

export default {
  cursor: 'draw',
  sizes: [8, 16, 30, 40],
  chosenSizeIndex: 1,
  draw({ secondaryContext, thumbnailSecondaryContext, currentPixel }) {
    console.error('TODO: add unique implementation.');
    
    validateDrawArgs({ secondaryContext, currentPixel,
      toBeValidatedArray: ['secondaryContext', 'currentPixel']
    });

    const size = this.sizes[this.chosenSizeIndex];

    function drawToContext(context) {
      context.beginPath();
      context.arc(currentPixel.x, currentPixel.y, size, 0, Math.PI * 2);
      context.fill();
    }

    drawToContext(secondaryContext);
    thumbnailSecondaryContext && drawToContext(thumbnailSecondaryContext);
  },
};