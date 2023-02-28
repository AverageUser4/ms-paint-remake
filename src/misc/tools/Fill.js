export default {
  cursor: 'fill',
  sizes: null,
  onPointerDown({ event, primaryContext, canvasSize, currentZoom, colorData }) {
    const { width, height } = canvasSize;
    let { offsetX, offsetY } = event.nativeEvent;
    offsetX = Math.round(offsetX / currentZoom);
    offsetY = Math.round(offsetY / currentZoom);
    const imageData = primaryContext.getImageData(0, 0, width, height);
    const color = event.button === 0 ? colorData.primary : colorData.secondary;

    function getIndexFromCoords(x, y) {
      return y * width * 4 + x * 4;
    }

    function getDataFromCoords(x, y) {
      const index = getIndexFromCoords(x, y);
      return {
        r: imageData.data[index],
        g: imageData.data[index + 1],
        b: imageData.data[index + 2],
        a: imageData.data[index + 3],
      };
    }

    function setPixelAtCoords(x, y) {
      const index = getIndexFromCoords(x, y);
      imageData.data[index] = color.r;
      imageData.data[index + 1] = color.g;
      imageData.data[index + 2] = color.b;
      imageData.data[index + 3] = 255;
    }

    function isSameColor(a, b) {
      return a.r === b.r && a.g === b.g && a.b === b.b;
    }
    
    const clickedColor = getDataFromCoords(offsetX, offsetY);
    let recursionTimes = 0;

    function checkAndChange(offsetX, offsetY) {
      const currentColor = getDataFromCoords(offsetX, offsetY);
      if(!isSameColor(clickedColor, currentColor) || ++recursionTimes > 10000) {
        return;
      }

      setPixelAtCoords(offsetX, offsetY);
      checkAndChange(offsetX - 1, offsetY);
      checkAndChange(offsetX + 1, offsetY);
      checkAndChange(offsetX, offsetY - 1);
      checkAndChange(offsetX, offsetY + 1);
    }

    checkAndChange(offsetX, offsetY);

    primaryContext.putImageData(imageData, 0, 0);
  }
};