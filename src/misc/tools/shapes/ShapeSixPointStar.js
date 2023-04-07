import ShapeBase from "./ShapeBase";
import validateToolArgs from "../validateToolArgs";

class ShapeSixPointStar extends ShapeBase {

  drawShape({ selectionContext, colorData, selectionSize, currentlyPressedRef, canvasZoom, shapeData }) {
    validateToolArgs(arguments, ['selectionContext', 'colorData', 'selectionSize', 'currentlyPressedRef', 'shapeData']);
    
    this.prepareAndDraw({ 
      selectionSize,
      currentlyPressedRef,
      colorData,
      selectionContext,
      canvasZoom,
      shapeData,
      drawCallback: ({ context, startXY, end }) => {
        context.beginPath();
        context.moveTo(startXY, startXY);
        context.lineTo(startXY, end.y);
        context.lineTo(end.x, end.y);
        context.closePath();
        shapeData.fill && context.fill();
        shapeData.outline && context.stroke();
      }
    });
  }

}

export default new ShapeSixPointStar();