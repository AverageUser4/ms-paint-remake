import ShapeBase from "./ShapeBase";
import validateToolArgs from "../validateToolArgs";

class ShapePentagon extends ShapeBase {

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
        context.moveTo(middle.x, startXY);
        context.lineTo(end.x, getCoordFromPercent('y', 40));
        context.lineTo(getCoordFromPercent('x', 85), end.y);
        context.lineTo(getCoordFromPercent('x', 15), end.y);
        context.lineTo(startXY, getCoordFromPercent('y', 40));
        context.closePath();
        shapeData.fill && context.fill();
        shapeData.outline && context.stroke();
      }
    });
  }

}

export default new ShapePentagon();