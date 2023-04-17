import ShapeBase from "./ShapeBase";
import validateToolArgs from "../validateToolArgs";

class ShapeLine extends ShapeBase {

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
        context.beginPath();
        context.moveTo(startXY, startXY);
        context.lineTo(end.x, end.y);
        shapeData.outline && context.stroke();
      }
    });
  }

}

export default new ShapeLine();