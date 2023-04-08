import ShapeBase from "./ShapeBase";
import validateToolArgs from "../validateToolArgs";

class ShapeOvalCallout extends ShapeBase {

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
        context.moveTo(getCoordFromPercent('x', 20), getCoordFromPercent('y', 80));
        context.lineTo(getCoordFromPercent('x', 22), end.y);
        context.lineTo(getCoordFromPercent('x', 40), getCoordFromPercent('y', 86));
        context.ellipse(
          getCoordFromPercent('x', 55), getCoordFromPercent('y', 45),
          Math.max(getCoordFromPercent('x', 40), 0),
          Math.max(getCoordFromPercent('y', 40), 0),
          0, 0, 2 * Math.PI
        );
        shapeData.fill && context.fill();
        shapeData.outline && context.stroke();
      }
    });
  }

}

export default new ShapeOvalCallout();