import ShapeBase from "./ShapeBase";
import validateToolArgs from "../validateToolArgs";

class ShapeCurve extends ShapeBase {

  drawShape({ selectionContext, colorData, selectionSize, currentlyPressedRef, canvasZoom, shapeData }) {
    validateToolArgs(arguments, ['selectionContext', 'colorData', 'selectionSize', 'currentlyPressedRef', 'shapeData']);
    
    this.prepareAndDraw({ 
      selectionSize,
      currentlyPressedRef,
      colorData,
      selectionContext,
      canvasZoom,
      shapeData,
      drawCallback: ({ context, start, endX, endY }) => {
        context.beginPath();
        context.moveTo(start, start);
        context.lineTo(start, endY);
        context.lineTo(endX, endY);
        context.closePath();
        shapeData.fill && context.fill();
        shapeData.outline && context.stroke();
      }
    });
  }

}

export default new ShapeCurve();