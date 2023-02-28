export default {
  cursor: 'draw',
  sizes: [8, 16, 30, 40],
  chosenSizeIndex: 1,
  draw({ secondaryContext, curX, curY }) {
    console.error('TODO: add unique implementation.');
    const size = this.sizes[this.chosenSizeIndex];

    secondaryContext.beginPath();
    secondaryContext.arc(curX, curY, size, 0, Math.PI * 2);
    secondaryContext.fill();
  },
};