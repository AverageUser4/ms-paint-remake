export default {
  cursor: 'selection',
  sizes: null,
  draw({ secondaryContext, curX, curY }) {
    const size = 2;
    secondaryContext.fillRect(curX, curY, size, size);
  },
};