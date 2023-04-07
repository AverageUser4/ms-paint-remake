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
      drawCallback: ({ context, startXY, end }) => {
        context.lineJoin = 'round';

        context.beginPath();
        context.moveTo(startXY, startXY);
        context.lineTo(end.x, startXY);
        context.lineTo(end.x, end.y);
        context.lineTo(startXY, end.y);
        context.closePath();
        shapeData.fill && context.fill();
        shapeData.outline && context.stroke();
      }
    });
  }

}

export default new ShapeRoundedRectangle();