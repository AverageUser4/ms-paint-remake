import ShapeBase from "./ShapeBase";
import validateToolArgs from "../validateToolArgs";

class ShapeLine extends ShapeBase {

  drawShape({ secondaryContext, colorData, canvasSize, currentlyPressedRef, shapeData, thumbnailSecondaryContext, lineData }) {
    validateToolArgs(arguments, ['secondaryContext', 'colorData', 'canvasSize', 'currentlyPressedRef', 'shapeData', 'thumbnailSecondaryContext', 'lineData']);
    
    this.prepareAndDraw({ 
      selectionSize: canvasSize,
      currentlyPressedRef,
      colorData,
      selectionContext: secondaryContext,
      shapeData,
      thumbnailSelectionContext: thumbnailSecondaryContext,
      drawCallback: ({ context }) => {
        context.lineCap = 'round';
        context.clearRect(0, 0, canvasSize.width, canvasSize.height);
        context.beginPath();
        context.moveTo(lineData.x1, lineData.y1);
        context.lineTo(lineData.x2, lineData.y2);
        shapeData.outline && context.stroke();
      }
    });
  }

}

export default new ShapeLine();