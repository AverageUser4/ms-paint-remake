import ShapeBase from "./ShapeBase";
import validateToolArgs from "../validateToolArgs";

class ShapeCurve extends ShapeBase {

  drawShape({ secondaryContext, colorData, canvasSize, currentlyPressedRef, shapeData, thumbnailSecondaryContext, curvePoints }) {
    validateToolArgs(arguments, ['secondaryContext', 'colorData', 'canvasSize', 'currentlyPressedRef', 'shapeData', 'thumbnailSecondaryContext', 'curvePoints']);
    
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
        context.moveTo(curvePoints.x1, curvePoints.y1);
        context.bezierCurveTo(curvePoints.x3, curvePoints.y3, curvePoints.x4, curvePoints.y4, curvePoints.x2, curvePoints.y2);
        context.stroke();
      }
    });
  }

}

export default new ShapeCurve();