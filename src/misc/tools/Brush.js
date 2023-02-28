export default {
  cursor: 'draw',
  sizes: [1, 3, 5, 8],
  chosenSizeIndex: 1,
  draw({ secondaryContext, curX, curY }) {
    const size = this.sizes[this.chosenSizeIndex];

    secondaryContext.beginPath();
    secondaryContext.arc(curX, curY, size, 0, Math.PI * 2);
    secondaryContext.fill();
  },
};