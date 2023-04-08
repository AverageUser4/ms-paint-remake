import ShapeBase from "./ShapeBase";
import validateToolArgs from "../validateToolArgs";

class ShapeDiamond extends ShapeBase {

  drawShape({ selectionContext, colorData, selectionSize, currentlyPressedRef, shapeData, thumbnailSelectionContext }) {
    validateToolArgs(arguments, ['selectionContext', 'colorData', 'selectionSize', 'currentlyPressedRef', 'shapeData', 'thumbnailSelectionContext']);
    
    this.prepareAndDraw({ 
      selectionSize,
      currentlyPressedRef,
      colorData,
      selectionContext,
      shapeData,
      thumbnailSelectionContext,
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