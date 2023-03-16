export default {
  cursor: 'magnifier',
  sizes: null,
  onPointerDown({ event, doCanvasChangeZoom }) {
    if(event.button === 2) {
      doCanvasChangeZoom(true);
    } else if(event.button === 0) {
      doCanvasChangeZoom();
    }
  },
  onPointerMove() {
    return;
  }
};