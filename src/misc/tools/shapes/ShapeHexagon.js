import ShapeBase from "./ShapeBase";
import validateToolArgs from "../validateToolArgs";

class ShapeHexagon extends ShapeBase {

  drawShape({ selectionContext, colorData, selectionSize, currentlyPressedRef, canvasZoom, shapeData }) {
    validateToolArgs(arguments, ['selectionContext', 'colorData', 'selectionSize', 'currentlyPressedRef', 'shapeData']);
    
    this.prepareAndDraw({ 
      selectionSize,
      currentlyPressedRef,
      colorData,
      selectionContext,
      canvasZoom,
      shapeData,
      drawCallback: ({ context, startXY, middle, end, getCoordFromPercent }) => {
        context.beginPath();
        context.moveTo(middle.x, startXY);
        context.lineTo(end.x, getCoordFromPercent('y', 25));
        context.lineTo(end.x, getCoordFromPercent('y', 75));
        context.lineTo(middle.x, end.y);
        context.lineTo(startXY, getCoordFromPercent('y', 75));
        context.lineTo(startXY, getCoordFromPercent('y', 25));
        context.closePath();
        shapeData.fill && context.fill();
        shapeData.outline && context.stroke();
      }
    });
  }

}

export default new ShapeHexagon();