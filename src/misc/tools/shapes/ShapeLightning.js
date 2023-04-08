import ShapeBase from "./ShapeBase";
import validateToolArgs from "../validateToolArgs";

class ShapeLightning extends ShapeBase {

  drawShape({ selectionContext, colorData, selectionSize, currentlyPressedRef, shapeData, thumbnailSelectionContext }) {
    validateToolArgs(arguments, ['selectionContext', 'colorData', 'selectionSize', 'currentlyPressedRef', 'shapeData', 'thumbnailSelectionContext']);
    
    this.prepareAndDraw({ 
      selectionSize,
      currentlyPressedRef,
      colorData,
      selectionContext,
      shapeData,
      thumbnailSelectionContext,
      drawCallback: ({ context, startXY, end, getCoordFromPercent }) => {
        context.beginPath();
        context.moveTo(startXY, getCoordFromPercent('y', 20));
        context.lineTo(getCoordFromPercent('x', 35), getCoordFromPercent('y', 38));
        context.lineTo(getCoordFromPercent('x', 25), getCoordFromPercent('y', 45));
        context.lineTo(getCoordFromPercent('x', 53), getCoordFromPercent('y', 63));
        context.lineTo(getCoordFromPercent('x', 47), getCoordFromPercent('y', 70));
        context.lineTo(end.x, end.y);
        context.lineTo(getCoordFromPercent('x', 65), getCoordFromPercent('y', 58));
        context.lineTo(getCoordFromPercent('x', 75), getCoordFromPercent('y', 53));
        context.lineTo(getCoordFromPercent('x', 50), getCoordFromPercent('y', 33));
        context.lineTo(getCoordFromPercent('x', 58), getCoordFromPercent('y', 28));
        context.lineTo(getCoordFromPercent('x', 39), startXY);

        context.closePath();
        shapeData.fill && context.fill();
        shapeData.outline && context.stroke();
      }
    });
  }

}

export default new ShapeLightning();