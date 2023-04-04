import { RGBObjectToString } from "../utils";

class ShapeBase {
  cursor = 'selection';
  sizes = [1, 3, 5, 8];
  chosenSize = 5;
  lastColorStr = '';

  getCanvasData({ selectionSize, currentlyPressedRef, selectionContext, colorData }) {
    console.log('gi')

    const start = this.chosenSize / 2;
    const endX = selectionSize.width - this.chosenSize / 2;
    const endY = selectionSize.height - this.chosenSize / 2;

    if(currentlyPressedRef.current === 0) {
      this.lastColorStr = RGBObjectToString(colorData.primary);
    } else if(currentlyPressedRef.current === 2) {
      this.lastColorStr = RGBObjectToString(colorData.secondary);
    }
    if(currentlyPressedRef.current === -1) {
      this.lastColorStr = RGBObjectToString(colorData.primary);
    }

    selectionContext.strokeStyle = this.lastColorStr;
    selectionContext.lineWidth = this.chosenSize;

    return { start, endX, endY };
  }

  drawShape() {
    console.error('Class inheriting from ShapeBase should have it\'s own drawShape method implemented.');
  }

  onPointerDown() {}
  onPointerMove() {}
}

export default ShapeBase;