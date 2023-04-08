import ShapeBase from "./ShapeBase";
import validateToolArgs from "../validateToolArgs";

class ShapeHeart extends ShapeBase {

  drawShape({ selectionContext, colorData, selectionSize, currentlyPressedRef, shapeData, thumbnailSelectionContext }) {
    validateToolArgs(arguments, ['selectionContext', 'colorData', 'selectionSize', 'currentlyPressedRef', 'shapeData', 'thumbnailSelectionContext']);
    
    this.prepareAndDraw({ 
      selectionSize,
      currentlyPressedRef,
      colorData,
      selectionContext,
      shapeData,
      thumbnailSelectionContext,
      drawCallback: ({ context, startXY, middle, end, getCoordFromPercent }) => {
        context.beginPath();
        context.moveTo(middle.x, end.y);
        context.quadraticCurveTo(end.x, getCoordFromPercent('y', 65), end.x, getCoordFromPercent('y', 30));
        context.quadraticCurveTo(getCoordFromPercent('x', 85), startXY - getCoordFromPercent('y', 20), middle.x, getCoordFromPercent('y', 15));
        context.quadraticCurveTo(getCoordFromPercent('x', 15), startXY - getCoordFromPercent('y', 20), startXY, getCoordFromPercent('y', 30));
        context.quadraticCurveTo(startXY, getCoordFromPercent('y', 65), middle.x, end.y);
        shapeData.fill && context.fill();
        shapeData.outline && context.stroke();
      }
    });
  }

}

export default new ShapeHeart();