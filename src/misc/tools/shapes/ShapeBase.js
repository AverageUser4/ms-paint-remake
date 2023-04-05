import { RGBObjectToString } from "../../utils";
import validateToolArgs from "../validateToolArgs";

class ShapeBase {
  cursor = 'selection';
  sizes = [1, 3, 5, 8];
  chosenSize = 5;
  lastOutlineColor;
  lastFillColor;
  lastPressed = null;

  prepareAndDraw({ selectionSize, currentlyPressedRef, selectionContext, colorData, canvasZoom, drawCallback, shapeData }) {
    validateToolArgs(arguments, ['selectionSize', 'currentlyPressedRef', 'selectionContext', 'colorData', 'canvasZoom', 'drawCallback', 'shapeData']);

    const start = this.chosenSize;
    const endX = selectionSize.width / canvasZoom - this.chosenSize;
    const endY = selectionSize.height / canvasZoom - this.chosenSize;

    if(currentlyPressedRef.current === 0) {
      this.lastOutlineColor = colorData.primary;
      this.lastFillColor = colorData.secondary;
      this.lastPressed = 0;
    } else if(currentlyPressedRef.current === 2) {
      this.lastOutlineColor = colorData.secondary;
      this.lastFillColor = colorData.primary;
      this.lastPressed = 2;
    } else if(this.lastPressed === 0) {
      this.lastOutlineColor = colorData.primary;
      this.lastFillColor = colorData.secondary;
    } else if(this.lastPressed === 2) {
      this.lastOutlineColor = colorData.secondary;
      this.lastFillColor = colorData.primary;
    }

    selectionContext.save();
    selectionContext.clearRect(0, 0, selectionSize.width, selectionSize.height);

    const usedOutlineColor = { ...this.lastOutlineColor };
    const usedFillColor = { ...this.lastFillColor };
    const outlineTexture = document.querySelector(`#pxp-texture-${shapeData.outline}`);
    const fillTexture = document.querySelector(`#pxp-texture-${shapeData.fill}`);

    let usedOutlineStyle = RGBObjectToString(usedOutlineColor);
    let usedFillStyle = RGBObjectToString(usedFillColor);

    if(shapeData.outline === 'marker') {
      usedOutlineColor.a = 0.75;
      usedOutlineStyle = RGBObjectToString(usedOutlineColor);
    } else if(shapeData.outline && outlineTexture) {
      usedOutlineStyle = selectionContext.createPattern(outlineTexture, '');
    }

    if(shapeData.fill === 'marker') {
      usedFillColor.a = 0.75;
      usedFillStyle = RGBObjectToString(usedFillColor);
    } else if(shapeData.fill && fillTexture) {
      usedFillStyle = selectionContext.createPattern(fillTexture, '');
    }

    selectionContext.strokeStyle = usedOutlineStyle;
    selectionContext.fillStyle = usedFillStyle;
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