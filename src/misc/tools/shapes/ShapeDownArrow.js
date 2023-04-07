import ShapeBase from "./ShapeBase";
import validateToolArgs from "../validateToolArgs";

class ShapeDownArrow extends ShapeBase {

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
        context.moveTo(getCoordFromPercent('x', 20), startXY);
        context.lineTo(getCoordFromPercent('x', 20), middle.y);
        context.lineTo(startXY, middle.y);
        context.lineTo(middle.x, end.y);
        context.lineTo(end.x, middle.y);
        context.lineTo(getCoordFromPercent('x', 80), middle.y);
        context.lineTo(getCoordFromPercent('x', 80), startXY);
        context.closePath();
        shapeData.fill && context.fill();
        shapeData.outline && context.stroke();
      }
    });
  }

}

export default new ShapeDownArrow();