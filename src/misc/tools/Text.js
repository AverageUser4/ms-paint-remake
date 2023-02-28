export default {
  cursor: 'text',
  sizes: null,
  draw({ secondaryContext, curX, curY }) {
    const size = this.sizes[this.chosenSizeIndex];
    
    if(size <= 2) {
      secondaryContext.fillRect(curX, curY, size, size);
    } else if(size === 3) {
      secondaryContext.fillRect(curX - 1, curY, 3, 1);
      secondaryContext.fillRect(curX, curY - 1, 1, 3);
    } else if(size === 4) {
      secondaryContext.fillRect(curX - 1, curY, 4, 2);
      secondaryContext.fillRect(curX, curY - 1, 2, 4);
    }
  },
};