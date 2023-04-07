import ShapeBase from "./ShapeBase";
import validateToolArgs from "../validateToolArgs";

class ShapeRightArrow extends ShapeBase {

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
        context.moveTo(startXY, getCoordFromPercent('y', 20));
        context.lineTo(middle.x, getCoordFromPercent('y', 20));
        context.lineTo(middle.x, startXY);
        context.lineTo(end.x, middle.y);
        context.lineTo(middle.x, end.y);
        context.lineTo(middle.x, getCoordFromPercent('y', 80));
        context.lineTo(startXY, getCoordFromPercent('y', 80));
        context.closePath();
        shapeData.fill && context.fill();
        shapeData.outline && context.stroke();
      }
    });
  }

}

export default new ShapeRightArrow();