function calculatePoint(originX, originY, radius) {
  /* http://jsfiddle.net/d9VRu/ */
  const angle = Math.random() * Math.PI * 2;
  const r = Math.sqrt(Math.random()) * radius;
  const x = originX + r * Math.cos(angle);
  const y = originY + r * Math.sin(angle);
  return { x: x, y: y };
}

export default {
  cursor: 'draw',
  sizes: [4, 8, 16, 24],
  chosenSizeIndex: 1,
  draw({ secondaryContext, curX, curY }) {
    console.error('TODO: add spray on mouse hold.');
    const size = this.sizes[this.chosenSizeIndex];

    function drawRandomPoints() {
      for(let i = 0; i < size; i++) {
        const { x: randX, y: randY } = calculatePoint(curX, curY, size);
        secondaryContext.fillRect(Math.round(randX), Math.round(randY), 1, 1);
      }
    }

    drawRandomPoints();
    // if(airbrushIntervalRef.current === null) {
    //   airbrushIntervalRef.current = setInterval(drawRandomPoints, 100);
    // }
  },
};

// const airbrushIntervalRef = useRef(null);

// useEffect(() => {
//   function clearAirbrushInterval() {
//     clearInterval(airbrushIntervalRef.current);
//     airbrushIntervalRef.current = null;
//   }

//   window.addEventListener('pointerup', clearAirbrushInterval);
//   window.addEventListener('pointermove', clearAirbrushInterval);

//   return () => {
//     window.removeEventListener('pointerup', clearAirbrushInterval);
//     window.removeEventListener('pointermove', clearAirbrushInterval);
//   }
// }, []);