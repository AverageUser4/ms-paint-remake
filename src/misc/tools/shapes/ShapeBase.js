import { RGBObjectToString, ImageDataUtils, getAverage } from "../../utils";
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

  prepareAndDraw({ selectionSize, currentlyPressedRef, selectionContext, colorData, drawCallback, shapeData, thumbnailSelectionContext }) {
    validateToolArgs(arguments, ['selectionSize', 'currentlyPressedRef', 'selectionContext', 'colorData', 'drawCallback', 'shapeData', 'thumbnailSelectionContext']);

    const startXY = (this.chosenSize / 2);
    const end = {
      x: selectionSize.width - (this.chosenSize / 2),
      y: selectionSize.height - (this.chosenSize / 2),
    };
    const middle = {
      x: selectionSize.width / 2,
      y: selectionSize.height / 2,
    };

    function getCoordFromPercent(axis, percent) {
      if(axis !== 'x' && axis !== 'y') {
        console.error('"axis" have to be "x" or "y", provided:', axis);
      }
      if(typeof percent !== 'number') {
        console.error('"percent" has to be a number, provided:', percent);
      }

      if(axis === 'x') {
        const width = end.x - startXY;
        return Math.round(startXY + width * (percent / 100));
      } else {
        const height = end.y - startXY;
        return Math.round(startXY + height * (percent / 100));
      }
    }

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
            a: Math.max(255 - Math.round(getAverage([currentColor.r, currentColor.g, currentColor.b])), 0),
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

    const size = this.chosenSize;

    function drawToContext(context) {
      context.save();
      context.strokeStyle = usedOutlineStyle;
      context.fillStyle = usedFillStyle;
      context.lineWidth = size;
      context.imageSmoothingEnabled = false;
      context.clearRect(0, 0, selectionSize.width, selectionSize.height);
      drawCallback({ context, startXY, end, middle, getCoordFromPercent });
      context.restore();
    }

    drawToContext(selectionContext);
    thumbnailSelectionContext && drawToContext(thumbnailSelectionContext);
  }

  drawShape() {
    console.error('Class extending ShapeBase should have it\'s own drawShape method implemented.');
  }

  onPointerDown() {}
  onPointerMove() {}
}

export default ShapeBase;