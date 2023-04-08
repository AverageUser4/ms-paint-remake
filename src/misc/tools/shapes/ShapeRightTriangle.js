import ShapeBase from "./ShapeBase";
import validateToolArgs from "../validateToolArgs";

class ShapeRightTriangle extends ShapeBase {

  drawShape({ selectionContext, colorData, selectionSize, currentlyPressedRef, shapeData, thumbnailSelectionContext }) {
    validateToolArgs(arguments, ['selectionContext', 'colorData', 'selectionSize', 'currentlyPressedRef', 'shapeData', 'thumbnailSelectionContext']);
    
    this.prepareAndDraw({ 
      selectionSize,
      currentlyPressedRef,
      colorData,
      selectionContext,
      shapeData,
      thumbnailSelectionContext,
      drawCallback: ({ context, startXY, end }) => {
        context.lineJoin = 'round';

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

export default new ShapeRightTriangle();