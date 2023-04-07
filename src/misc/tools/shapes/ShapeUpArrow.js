import ShapeBase from "./ShapeBase";
import validateToolArgs from "../validateToolArgs";

class ShapeUpArrow extends ShapeBase {

  drawShape({ selectionContext, colorData, selectionSize, currentlyPressedRef, canvasZoom, shapeData }) {
    validateToolArgs(arguments, ['selectionContext', 'colorData', 'selectionSize', 'currentlyPressedRef', 'shapeData']);
    
    this.prepareAndDraw({ 
      selectionSize,
      currentlyPressedRef,
      colorData,
      selectionContext,
      canvasZoom,
      shapeData,
      drawCallback: ({ context, startXY, end, middle, getCoordFromPercent }) => {
        context.beginPath();
        context.moveTo(getCoordFromPercent('x', 20), end.y);
        context.lineTo(getCoordFromPercent('x', 20), middle.y);
        context.lineTo(startXY, middle.y);
        context.lineTo(middle.x, startXY);
        context.lineTo(end.x, middle.y);
        context.lineTo(getCoordFromPercent('x', 80), middle.y);
        context.lineTo(getCoordFromPercent('x', 80), end.y);
        context.closePath();
        shapeData.fill && context.fill();
        shapeData.outline && context.stroke();
      }
    });
  }

}

export default new ShapeUpArrow();