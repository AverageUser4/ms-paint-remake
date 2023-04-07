import ShapeBase from "./ShapeBase";
import validateToolArgs from "../validateToolArgs";

class ShapeRoundedRectangle extends ShapeBase {

  drawShape({ selectionContext, colorData, selectionSize, currentlyPressedRef, canvasZoom, shapeData }) {
    validateToolArgs(arguments, ['selectionContext', 'colorData', 'selectionSize', 'currentlyPressedRef', 'shapeData']);
    
    this.prepareAndDraw({ 
      selectionSize,
      currentlyPressedRef,
      colorData,
      selectionContext,
      canvasZoom,
      shapeData,
      drawCallback: ({ context, startXY, end, getCoordFromPercent }) => {
        let radius = Math.round(Math.min(end.x, end.y) / 10);

        context.beginPath();
        context.moveTo(getCoordFromPercent('x', 10), startXY);
        context.lineTo(getCoordFromPercent('x', 90), startXY);
        context.arcTo(end.x, startXY, end.x, getCoordFromPercent('y', 10), radius);
        context.lineTo(end.x, getCoordFromPercent('y', 90));
        context.arcTo(end.x, end.y, getCoordFromPercent('x', 90), end.y, radius);
        context.lineTo(getCoordFromPercent('x', 10), end.y);
        context.arcTo(startXY, end.y, startXY, startXY, radius);
        context.lineTo(startXY, getCoordFromPercent('y', 10));
        context.arcTo(startXY, startXY, getCoordFromPercent('x', 10), startXY, radius);
        context.closePath();
        shapeData.fill && context.fill();
        shapeData.outline && context.stroke();
      }
    });
  }

}

export default new ShapeRoundedRectangle();