import ShapeBase from "./ShapeBase";
import validateToolArgs from "../validateToolArgs";

class ShapeLeftArrow extends ShapeBase {

  drawShape({ selectionContext, colorData, selectionSize, currentlyPressedRef, canvasZoom, shapeData, thumbnailSelectionContext }) {
    validateToolArgs(arguments, ['selectionContext', 'colorData', 'selectionSize', 'currentlyPressedRef', 'shapeData', 'thumbnailSelectionContext']);
    
    this.prepareAndDraw({ 
      selectionSize,
      currentlyPressedRef,
      colorData,
      selectionContext,
      canvasZoom,
      shapeData,
      thumbnailSelectionContext,
      drawCallback: ({ context, startXY, end, middle, getCoordFromPercent }) => {
        context.beginPath();
        context.moveTo(end.x, getCoordFromPercent('y', 20));
        context.lineTo(middle.x, getCoordFromPercent('y', 20));
        context.lineTo(middle.x, startXY);
        context.lineTo(startXY, middle.y);
        context.lineTo(middle.x, end.y);
        context.lineTo(middle.x, getCoordFromPercent('y', 80));
        context.lineTo(end.x, getCoordFromPercent('y', 80));
        context.closePath();
        shapeData.fill && context.fill();
        shapeData.outline && context.stroke();
      }
    });
  }

}

export default new ShapeLeftArrow();