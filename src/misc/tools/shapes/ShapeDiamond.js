import ShapeBase from "./ShapeBase";
import validateToolArgs from "../validateToolArgs";

class ShapeDiamond extends ShapeBase {

  drawShape({ selectionContext, colorData, selectionSize, currentlyPressedRef, canvasZoom, shapeData }) {
    validateToolArgs(arguments, ['selectionContext', 'colorData', 'selectionSize', 'currentlyPressedRef', 'shapeData']);
    
    this.prepareAndDraw({ 
      selectionSize,
      currentlyPressedRef,
      colorData,
      selectionContext,
      canvasZoom,
      shapeData,
      drawCallback: ({ context, startXY, middle, end }) => {
        context.beginPath();
        context.moveTo(middle.x, startXY);
        context.lineTo(end.x, middle.y);
        context.lineTo(middle.x, end.y);
        context.lineTo(startXY, middle.y);
        context.closePath();
        shapeData.fill && context.fill();
        shapeData.outline && context.stroke();
      }
    });
  }

}

export default new ShapeDiamond();