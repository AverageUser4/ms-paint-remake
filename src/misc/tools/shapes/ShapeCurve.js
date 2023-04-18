import ShapeBase from "./ShapeBase";
import validateToolArgs from "../validateToolArgs";

class ShapeCurve extends ShapeBase {

  drawShape({ 
    secondaryContext,
    thumbnailSecondaryContext,
    selectionContext,
    thumbnailSelectionContext,
    selectionPhase,
    colorData,
    shapeData,
    canvasSize,
    curvePoints,
    currentCurvePointRef,
    currentlyPressedRef,
  }) {
    validateToolArgs(arguments, [
      'secondaryContext',
      'thumbnailSecondaryContext',
      // 'selectionContext',
      'thumbnailSelectionContext',
      'selectionPhase',
      'colorData',
      'shapeData',
      'canvasSize',
      'curvePoints',
      'currentCurvePointRef',
      'currentlyPressedRef',
    ]);
    
    this.prepareAndDraw({ 
      selectionSize: canvasSize,
      currentlyPressedRef,
      colorData,
      selectionContext: selectionPhase ? selectionContext : secondaryContext,
      shapeData,
      thumbnailSelectionContext: selectionPhase ? thumbnailSelectionContext : thumbnailSecondaryContext,
      drawCallback: ({ context }) => {
        context.lineCap = 'round';
        context.clearRect(0, 0, canvasSize.width, canvasSize.height);

        context.beginPath();
        context.moveTo(curvePoints.x1, curvePoints.y1);
        if(currentCurvePointRef.current <= 3) {
          context.quadraticCurveTo(curvePoints.x3, curvePoints.y3, curvePoints.x2, curvePoints.y2);
        } else {
          context.bezierCurveTo(curvePoints.x3, curvePoints.y3, curvePoints.x4, curvePoints.y4, curvePoints.x2, curvePoints.y2);
        }
        context.stroke();
      }
    });
  }

}

export default new ShapeCurve();