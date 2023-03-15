import { objectEquals } from "../utils";
import { ImageDataUtils } from "../utils";

export default {
  cursor: 'fill',
  sizes: null,
  onPointerDown({ event, primaryContext, thumbnailPrimaryContext, canvasSize, currentZoom, colorData }) {
    const { width, height } = canvasSize;
    let { offsetX, offsetY } = event.nativeEvent;
    offsetX = Math.round(offsetX / currentZoom);
    offsetY = Math.round(offsetY / currentZoom);
    const imageData = primaryContext.getImageData(0, 0, width, height);
    const color = event.button === 0 ? colorData.primary : colorData.secondary;

    const clickedColor = ImageDataUtils.getColorFromCoords(imageData, offsetX, offsetY);
    let recursionTimes = 0;

    function checkAndChange(offsetX, offsetY) {
      const currentColor = ImageDataUtils.getColorFromCoords(imageData, offsetX, offsetY);
      if(
          !objectEquals(clickedColor, currentColor, ['a'])
          || ++recursionTimes > 5000
        ) {
        return;
      }

      ImageDataUtils.setColorAtCoords(imageData, offsetX, offsetY, color);

      if(offsetX - 1 >= 0) {
        checkAndChange(offsetX - 1, offsetY);
      }
      if(offsetX + 1 < imageData.width) {
        checkAndChange(offsetX + 1, offsetY);
      }
      if(offsetY - 1 >= 0) {
        checkAndChange(offsetX, offsetY - 1);
      }
      if(offsetY + 1 < imageData.height) {
        checkAndChange(offsetX, offsetY + 1);
      }

    }

    checkAndChange(offsetX, offsetY);

    primaryContext.putImageData(imageData, 0, 0);
    thumbnailPrimaryContext && thumbnailPrimaryContext.putImageData(imageData, 0, 0);
  },
  onPointerMove() {
    return;
  }
};