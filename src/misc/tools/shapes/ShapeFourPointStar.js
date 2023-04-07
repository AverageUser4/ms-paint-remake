import ShapeBase from "./ShapeBase";
import validateToolArgs from "../validateToolArgs";

class ShapeFourPointStar extends ShapeBase {

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
        const offsetA = 37;
        
        context.beginPath();
        context.moveTo(middle.x, startXY);
        context.lineTo(getCoordFromPercent('x', 100 - offsetA), getCoordFromPercent('y', offsetA));
        context.lineTo(end.x, middle.y);
        context.lineTo(getCoordFromPercent('x', 100 - offsetA), getCoordFromPercent('y', 100 - offsetA));
        context.lineTo(middle.x, end.y);
        context.lineTo(getCoordFromPercent('x', offsetA), getCoordFromPercent('y', 100 - offsetA));
        context.lineTo(startXY, middle.y);
        context.lineTo(getCoordFromPercent('x', offsetA), getCoordFromPercent('y', offsetA));
        context.closePath();
        shapeData.fill && context.fill();
        shapeData.outline && context.stroke();
      }
    });
  }

}

export default new ShapeFourPointStar();