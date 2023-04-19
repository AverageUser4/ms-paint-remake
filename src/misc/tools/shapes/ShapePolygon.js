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
          console.error('not implemented');
        } else {
          context.moveTo(polygonPoints[0].x, polygonPoints[0].y);

          for(let i = 1; i < polygonPoints.length; i++) {
            context.lineTo(polygonPoints[i].x, polygonPoints[i].y);
          }
        }

        context.stroke();
      }
    });
  }

}

export default new ShapePolygon();