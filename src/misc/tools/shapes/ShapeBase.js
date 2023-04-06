import { RGBObjectToString, ImageDataUtils, getAverage, doGetCanvasCopy } from "../../utils";
import validateToolArgs from "../validateToolArgs";

class ShapeBase {
  static outlineCanvas = null;
  static shapeCanvas = null;
  static lastOutlineColor;
  static lastFillColor;
  static lastPressed = null;
  static lastFillType = null;
  static lastOutlineType = null;

  cursor = 'selection';
  sizes = [1, 3, 5, 8];
  chosenSize = 5;

  prepareAndDraw({ selectionSize, currentlyPressedRef, selectionContext, colorData, canvasZoom, drawCallback, shapeData }) {
    validateToolArgs(arguments, ['selectionSize', 'currentlyPressedRef', 'selectionContext', 'colorData', 'canvasZoom', 'drawCallback', 'shapeData']);

    const start = this.chosenSize;
    const endX = selectionSize.width / canvasZoom - this.chosenSize;
    const endY = selectionSize.height / canvasZoom - this.chosenSize;

    const previousFillColor = ShapeBase.lastFillColor;
    const previousOutlineColor = ShapeBase.lastOutlineColor;

    if(currentlyPressedRef.current === 0) {
      ShapeBase.lastOutlineColor = colorData.primary;
      ShapeBase.lastFillColor = colorData.secondary;
      ShapeBase.lastPressed = 0;
    } else if(currentlyPressedRef.current === 2) {
      ShapeBase.lastOutlineColor = colorData.secondary;
      ShapeBase.lastFillColor = colorData.primary;
      ShapeBase.lastPressed = 2;
    } else if(ShapeBase.lastPressed === 0) {
      ShapeBase.lastOutlineColor = colorData.primary;
      ShapeBase.lastFillColor = colorData.secondary;
    } else if(ShapeBase.lastPressed === 2) {
      ShapeBase.lastOutlineColor = colorData.secondary;
      ShapeBase.lastFillColor = colorData.primary;
    }

    const usedOutlineColor = { ...ShapeBase.lastOutlineColor };
    const usedFillColor = { ...ShapeBase.lastFillColor };
    let outlineTexture = document.querySelector(`#pxp-texture-${shapeData.outline}`);
    let fillTexture = document.querySelector(`#pxp-texture-${shapeData.fill}`);

    function prepareTexture(targetCanvas) {
      let color = ShapeBase.lastFillColor;
      let texture = fillTexture;

      if(targetCanvas === 'outline') {
        color = ShapeBase.lastOutlineColor;
        texture = outlineTexture;
      }

      const canvas = document.createElement('canvas');
      canvas.width = texture.naturalWidth;
      canvas.height = texture.naturalHeight;
      const context = canvas.getContext('2d');

      context.drawImage(texture, 0, 0);
    
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    
      for(let y = 0; y < canvas.height; y++) {
        for(let x = 0; x < canvas.width; x++) {
          const currentColor = ImageDataUtils.getColorFromCoords(imageData, x, y);
          const modifiedColor = {
            r: Math.max(color.r - currentColor.r, 0),
            g: Math.max(color.g - currentColor.g, 0),
            b: Math.max(color.b - currentColor.b, 0),
            a: Math.max(255 - getAverage(currentColor.r, currentColor.g, currentColor.b), 0),
          };
          ImageDataUtils.setColorAtCoords(imageData, x, y, modifiedColor);
        }
      }
    
      context.putImageData(imageData, 0, 0);
      ShapeBase[`${targetCanvas}Canvas`] = canvas;

      return texture;
    }

    if(
        (ShapeBase.lastFillColor !== previousFillColor || shapeData.fill !== ShapeBase.lastFillType) &&
        shapeData.fill && shapeData.fill !== 'marker' && fillTexture
      ) {
        fillTexture = prepareTexture('fill');
    }

    if(
      (ShapeBase.lastOutlineColor !== previousOutlineColor || shapeData.outline !== ShapeBase.lastOutlineType) &&
      shapeData.outline && shapeData.outline !== 'marker' && outlineTexture
    ) {
      outlineTexture = prepareTexture('outline');
    }

    ShapeBase.lastFillType = shapeData.fill;
    ShapeBase.lastOutlineType = shapeData.outline;

    let usedOutlineStyle = RGBObjectToString(usedOutlineColor);
    let usedFillStyle = RGBObjectToString(usedFillColor);

    if(shapeData.outline === 'marker') {
      usedOutlineColor.a = 0.75;
      usedOutlineStyle = RGBObjectToString(usedOutlineColor);
    } else if(shapeData.outline && outlineTexture) {
      if(ShapeBase.outlineCanvas) {
        usedOutlineStyle = selectionContext.createPattern(ShapeBase.outlineCanvas, '');
      } else if(outlineTexture) {
        usedOutlineStyle = selectionContext.createPattern(outlineTexture, '');
      }
    }

    if(shapeData.fill === 'marker') {
      usedFillColor.a = 0.75;
      usedFillStyle = RGBObjectToString(usedFillColor);
    } else if(shapeData.fill) {
      if(ShapeBase.fillCanvas) {
        usedFillStyle = selectionContext.createPattern(ShapeBase.fillCanvas, '');
      } else if(fillTexture) {
        usedFillStyle = selectionContext.createPattern(fillTexture, '');
      }
    }

    selectionContext.save();
    selectionContext.clearRect(0, 0, selectionSize.width, selectionSize.height);

    const copy = document.createElement('canvas');
    copy.width = Math.max(1, Math.round(selectionSize.width / canvasZoom));
    copy.height = Math.max(1, Math.round(selectionSize.height / canvasZoom));

    const context = copy.getContext('2d');
    context.strokeStyle = usedOutlineStyle;
    context.fillStyle = usedFillStyle;
    context.lineWidth = this.chosenSize;
    context.imageSmoothingEnabled = false;
    context.lineJoin = 'round';

    drawCallback({ context, start, endX, endY });

    selectionContext.imageSmoothingEnabled = false;
    selectionContext.clearRect(0, 0, selectionSize.width, selectionSize.height);
    selectionContext.scale(canvasZoom, canvasZoom);
    selectionContext.drawImage(copy, 0, 0);

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