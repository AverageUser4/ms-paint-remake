import { zoomData } from "../data";

export default {
  cursor: 'magnifier',
  sizes: null,
  onPointerDown({ event, currentZoom, setCanvasZoom }) {
    const currentZoomIndex = zoomData.findIndex(data => data.multiplier === currentZoom);
    if(event.button === 2 && currentZoomIndex > 0) {
      setCanvasZoom(zoomData[currentZoomIndex - 1].multiplier);
    } else if(event.button === 0 && currentZoomIndex < zoomData.length - 1) {
      setCanvasZoom(zoomData[currentZoomIndex + 1].multiplier);
    }
  },
  onPointerMove() {
    return;
  }
};