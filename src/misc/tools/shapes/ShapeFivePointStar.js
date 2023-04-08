import ShapeBase from "./ShapeBase";
import validateToolArgs from "../validateToolArgs";

class ShapeFivePointStar extends ShapeBase {

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
        context.lineTo(getCoordFromPercent('x', 60), getCoordFromPercent('y', 37));
        context.lineTo(end.x, getCoordFromPercent('y', 42));
        context.lineTo(getCoordFromPercent('x', 70), getCoordFromPercent('y', 60));
        context.lineTo(getCoordFromPercent('x', 80), end.y);
        context.lineTo(middle.x, getCoordFromPercent('y', 75));
        context.lineTo(getCoordFromPercent('x', 20), end.y);
        context.lineTo(getCoordFromPercent('x', 30), getCoordFromPercent('y', 60));
        context.lineTo(startXY, getCoordFromPercent('y', 42));
        context.lineTo(getCoordFromPercent('x', 40), getCoordFromPercent('y', 37));
        context.closePath();
        shapeData.fill && context.fill();
        shapeData.outline && context.stroke();
      }
    });
  }

}

export default new ShapeFivePointStar();