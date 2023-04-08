import ShapeBase from "./ShapeBase";
import validateToolArgs from "../validateToolArgs";

class ShapeSixPointStar extends ShapeBase {

  drawShape({ selectionContext, colorData, selectionSize, currentlyPressedRef, shapeData, thumbnailSelectionContext }) {
    validateToolArgs(arguments, ['selectionContext', 'colorData', 'selectionSize', 'currentlyPressedRef', 'shapeData', 'thumbnailSelectionContext']);
    
    this.prepareAndDraw({ 
      selectionSize,
      currentlyPressedRef,
      colorData,
      selectionContext,
      shapeData,
      thumbnailSelectionContext,
      drawCallback: ({ context, startXY, end, middle, getCoordFromPercent }) => {
        context.beginPath();
        context.moveTo(middle.x, startXY);
        context.lineTo(getCoordFromPercent('x', 65), getCoordFromPercent('y', 25));
        context.lineTo(end.x, getCoordFromPercent('y', 25));
        context.lineTo(getCoordFromPercent('x', 85), middle.y);
        context.lineTo(end.x, getCoordFromPercent('y', 75));
        context.lineTo(getCoordFromPercent('x', 65), getCoordFromPercent('y', 75));
        context.lineTo(middle.x, end.y);
        context.lineTo(getCoordFromPercent('x', 35), getCoordFromPercent('y', 75));
        context.lineTo(startXY, getCoordFromPercent('y', 75));
        context.lineTo(getCoordFromPercent('x', 15), middle.y);
        context.lineTo(startXY, getCoordFromPercent('y', 25));
        context.lineTo(getCoordFromPercent('x', 35), getCoordFromPercent('y', 25));
        context.closePath();
        shapeData.fill && context.fill();
        shapeData.outline && context.stroke();
      }
    });
  }

}

export default new ShapeSixPointStar();