export default  {
  cursor: 'draw',
  sizes: [3, 5, 8, 10],
  chosenSizeIndex: 1,
  draw({ secondaryContext, curX, curY }) {
    const size = this.sizes[this.chosenSizeIndex];

    if(size === 3) {
      secondaryContext.fillRect(curX - 1, curY + 1, 2, 1);
      secondaryContext.fillRect(curX, curY, 2, 1);
      secondaryContext.fillRect(curX + 1, curY - 1, 2, 1);
    } else if(size === 5) {
      secondaryContext.fillRect(curX - 2, curY + 2, 2, 1);
      secondaryContext.fillRect(curX - 1, curY + 1, 2, 1);
      secondaryContext.fillRect(curX, curY, 2, 1);
      secondaryContext.fillRect(curX + 1, curY - 1, 2, 1);
      secondaryContext.fillRect(curX + 2, curY - 2, 2, 1);
    } else if(size === 8) {
      secondaryContext.fillRect(curX - 4, curY + 4, 2, 1);
      secondaryContext.fillRect(curX - 3, curY + 3, 2, 1);
      secondaryContext.fillRect(curX - 2, curY + 2, 2, 1);
      secondaryContext.fillRect(curX - 1, curY + 1, 2, 1);
      secondaryContext.fillRect(curX, curY, 2, 1);
      secondaryContext.fillRect(curX + 1, curY - 1, 2, 1);
      secondaryContext.fillRect(curX + 2, curY - 2, 2, 1);
      secondaryContext.fillRect(curX + 3, curY - 3, 2, 1);
    } else if(size === 10) {
      secondaryContext.fillRect(curX - 5, curY + 5, 2, 1);
      secondaryContext.fillRect(curX - 4, curY + 4, 2, 1);
      secondaryContext.fillRect(curX - 3, curY + 3, 2, 1);
      secondaryContext.fillRect(curX - 2, curY + 2, 2, 1);
      secondaryContext.fillRect(curX - 1, curY + 1, 2, 1);
      secondaryContext.fillRect(curX, curY, 2, 1);
      secondaryContext.fillRect(curX + 1, curY - 1, 2, 1);
      secondaryContext.fillRect(curX + 2, curY - 2, 2, 1);
      secondaryContext.fillRect(curX + 3, curY - 3, 2, 1);
      secondaryContext.fillRect(curX + 4, curY - 4, 2, 1);
    }
  },
};