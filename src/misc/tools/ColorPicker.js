export default {
  cursor: 'color-picker',
  sizes: null,
  onPointerDown({ event, primaryContext, currentZoom, setColorData }) {
    const { offsetX, offsetY } = event.nativeEvent;
    const data = primaryContext.getImageData(Math.round(offsetX / currentZoom), Math.round(offsetY / currentZoom), 1, 1);
    const RGB = { r: data.data[0], g: data.data[1], b: data.data[2] };
    if(event.button === 0) {
      setColorData(prev => ({ ...prev, primary: RGB }));
    } else if(event.button === 2) {
      setColorData(prev => ({ ...prev, secondary: RGB }));
    }
  },
  onPointerMove() {
    return;
  }
};