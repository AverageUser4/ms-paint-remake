import ShapeBase from "./ShapeBase";
import validateToolArgs from "../validateToolArgs";

class ShapePolygon extends ShapeBase {

  drawShape({ 
    secondaryContext, thumbnailSecondaryContext, selectionContext,
    thumbnailSelectionContext, selectionPhase, colorData, shapeData,
    canvasSize, polygonPoints, currentlyPressedRef, polygonPointPercents,
    selectionSize,
  }) {
    validateToolArgs(arguments, [
      'secondaryContext', 'thumbnailSecondaryContext', /* 'selectionContext', */
      'thumbnailSelectionContext', 'selectionPhase', 'colorData', 'shapeData',
      'canvasSize', 'currentlyPressedRef',
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

        if(polygonPointPercents) {
          context.moveTo(getCoordFromPercent('x', polygonPointPercents[0].x), getCoordFromPercent('y', polygonPointPercents[0].y));
          for(let i = 1; i < polygonPointPercents.length; i++) {
            context.lineTo(getCoordFromPercent('x', polygonPointPercents[i].x), getCoordFromPercent('y', polygonPointPercents[i].y))
          }
          context.closePath();
        } else {
          context.moveTo(polygonPoints[0].x, polygonPoints[0].y);
          for(let i = 1; i < polygonPoints.length; i++) {
            context.lineTo(polygonPoints[i].x, polygonPoints[i].y);
          }
        }

        shapeData.fill && context.fill();
        shapeData.outline && context.stroke();
      }
    });
  }

}

export default new ShapePolygon();