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
    curvePointPercents,
    selectionSize,
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

    let usedSize = canvasSize;
    let usedContext = secondaryContext;
    let usedThumbnailContext = thumbnailSecondaryContext;

    if(selectionPhase) {
      usedSize = selectionSize;
      usedContext = selectionContext;
      usedThumbnailContext = thumbnailSelectionContext;
    }
    
    this.prepareAndDraw({ 
      selectionSize: usedSize,
      currentlyPressedRef,
      colorData,
      selectionContext: usedContext,
      shapeData,
      thumbnailSelectionContext: usedThumbnailContext,
      drawCallback: ({ context, getCoordFromPercent }) => {
        context.lineCap = 'round';
        context.clearRect(0, 0, usedSize.width, usedSize.height);

        context.beginPath();

        if(!selectionPhase && currentCurvePointRef.current <= 3) {
          context.moveTo(curvePoints.x1, curvePoints.y1);
          context.quadraticCurveTo(curvePoints.x3, curvePoints.y3, curvePoints.x2, curvePoints.y2);
        } else if(!curvePointPercents) {
          context.moveTo(curvePoints.x1, curvePoints.y1);
          context.bezierCurveTo(curvePoints.x3, curvePoints.y3, curvePoints.x4, curvePoints.y4, curvePoints.x2, curvePoints.y2);
        } else {
          context.moveTo(getCoordFromPercent('x', curvePointPercents.x1), getCoordFromPercent('y', curvePointPercents.y1));
          context.bezierCurveTo(
            getCoordFromPercent('x', curvePointPercents.x3), getCoordFromPercent('y', curvePointPercents.y3),
            getCoordFromPercent('x', curvePointPercents.x4), getCoordFromPercent('y', curvePointPercents.y4),
            getCoordFromPercent('x', curvePointPercents.x2), getCoordFromPercent('y', curvePointPercents.y2),
          );
        }

        context.stroke();
      }
    });
  }

}

export default new ShapeCurve();