import ShapeBase from "./ShapeBase";
import validateToolArgs from "../validateToolArgs";

class ShapeRoundedRectangularCallout extends ShapeBase {

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
        let radius = Math.round(Math.min(end.x, end.y) / 10);

        context.beginPath();
        context.moveTo(getCoordFromPercent('x', 16), getCoordFromPercent('y', 87));
        context.lineTo(getCoordFromPercent('x', 27), end.y);
        context.lineTo(getCoordFromPercent('x', 38), getCoordFromPercent('y', 87));
        context.lineTo(getCoordFromPercent('x', 85), getCoordFromPercent('y', 87));
        context.arcTo(
          end.x, getCoordFromPercent('y', 87),
          end.x, getCoordFromPercent('y', 75),
          radius
        );
        context.lineTo(end.x, getCoordFromPercent('y', 15));
        context.arcTo(
          end.x, startXY,
          getCoordFromPercent('x', 85), startXY,
          radius
        );
        context.lineTo(getCoordFromPercent('x', 13), startXY);
        context.arcTo(
          startXY, startXY,
          startXY, getCoordFromPercent('y', 15),
          radius
        );
        context.lineTo(startXY, getCoordFromPercent('y', 75));
        context.arcTo(
          startXY, getCoordFromPercent('y', 87),
          getCoordFromPercent('x', 16), getCoordFromPercent('y', 87),
          radius
        );
        context.closePath();
        shapeData.fill && context.fill();
        shapeData.outline && context.stroke();
      }
    });
  }

}

export default new ShapeRoundedRectangularCallout();