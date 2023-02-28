function calculatePoint(originX, originY, radius) {
  /* http://jsfiddle.net/d9VRu/ */
  const angle = Math.random() * Math.PI * 2;
  const r = Math.sqrt(Math.random()) * radius;
  const x = originX + r * Math.cos(angle);
  const y = originY + r * Math.sin(angle);
  return { x: x, y: y };
}

export default {
  latestX: null,
  latestY: null,
  cursor: 'draw',
  sizes: [4, 8, 16, 24],
  chosenSizeIndex: 1,
  draw({ secondaryContext, curX, curY, currentlyPressedRef }) {
    const size = this.sizes[this.chosenSizeIndex];
    this.latestX = curX;
    this.latestY = curY;

    function drawRandomPoints() {
      for(let i = 0; i < size; i++) {
        const { x: randX, y: randY } = calculatePoint(curX, curY, size);
        secondaryContext.fillRect(Math.round(randX), Math.round(randY), 1, 1);
      }
    }

    function timeoutCallback() {
      if(
          currentlyPressedRef.current === -1 ||
          curX !== this.latestX ||
          curY !== this.latestY
        ) {
        return;
      }

      drawRandomPoints();
      setTimeout(timeoutCallback.bind(this), 100);
    }
    
    timeoutCallback.apply(this);
  },
};