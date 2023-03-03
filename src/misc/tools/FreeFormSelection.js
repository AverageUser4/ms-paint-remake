export default {
  cursor: 'selection',
  sizes: null,
  draw({ secondaryContext, curX, curY }) {
    const size = 1;
    secondaryContext.fillRect(curX, curY, size, size);
  },
};