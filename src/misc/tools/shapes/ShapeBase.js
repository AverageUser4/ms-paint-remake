import { RGBObjectToString } from "../../utils";
import validateToolArgs from "../validateToolArgs";

class ShapeBase {
  cursor = 'selection';
  sizes = [1, 3, 5, 8];
  chosenSize = 5;
  lastOutlineColorStr = '';
  lastFillColorStr = '';
  lastPressed = null;

  prepareAndDraw({ selectionSize, currentlyPressedRef, selectionContext, colorData, canvasZoom, drawCallback }) {
    validateToolArgs(arguments, ['selectionSize', 'currentlyPressedRef', 'selectionContext', 'colorData', 'canvasZoom', 'drawCallback']);

    const start = this.chosenSize;
    const endX = selectionSize.width / canvasZoom - this.chosenSize;
    const endY = selectionSize.height / canvasZoom - this.chosenSize;

    if(currentlyPressedRef.current === 0) {
      this.lastOutlineColorStr = RGBObjectToString(colorData.primary);
      this.lastFillColorStr = RGBObjectToString(colorData.secondary);
      this.lastPressed = 0;
    } else if(currentlyPressedRef.current === 2) {
      this.lastOutlineColorStr = RGBObjectToString(colorData.secondary);
      this.lastFillColorStr = RGBObjectToString(colorData.primary);
      this.lastPressed = 2;
    } else if(this.lastPressed === 0) {
      this.lastOutlineColorStr = RGBObjectToString(colorData.primary);
      this.lastFillColorStr = RGBObjectToString(colorData.secondary);
    } else if(this.lastPressed === 2) {
      this.lastOutlineColorStr = RGBObjectToString(colorData.secondary);
      this.lastFillColorStr = RGBObjectToString(colorData.primary);
    }

    selectionContext.save();
    selectionContext.clearRect(0, 0, selectionSize.width, selectionSize.height);

    selectionContext.strokeStyle = this.lastOutlineColorStr;
    selectionContext.fillStyle = this.lastFillColorStr;
    selectionContext.lineWidth = this.chosenSize;
    selectionContext.imageSmoothingEnabled = false;

    selectionContext.scale(canvasZoom, canvasZoom);
    drawCallback({ start, endX, endY });
    selectionContext.restore();

    return { start, endX, endY };
  }

  drawShape() {
    console.error('Class inheriting from ShapeBase should have it\'s own drawShape method implemented.');
  }

  onPointerDown() {}
  onPointerMove() {}
}

export default ShapeBase;