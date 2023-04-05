import ShapeBase from "./ShapeBase";
import validateToolArgs from "../validateToolArgs";

class ShapeCloudCallout extends ShapeBase {

  drawShape({ selectionContext, colorData, selectionSize, currentlyPressedRef, canvasZoom, shapeData }) {
    validateToolArgs(arguments, ['selectionContext', 'colorData', 'selectionSize', 'currentlyPressedRef', 'shapeData']);
    
    this.prepareAndDraw({ 
      selectionSize,
      currentlyPressedRef,
      colorData,
      selectionContext,
      canvasZoom,
      shapeData,
      drawCallback: ({ start, endX, endY }) => {
        selectionContext.beginPath();
        selectionContext.moveTo(start, start);
        selectionContext.lineTo(start, endY);
        selectionContext.lineTo(endX, endY);
        selectionContext.closePath();
        shapeData.fill && selectionContext.fill();
        shapeData.outline && selectionContext.stroke();
      }
    });
  }

}

export default new ShapeCloudCallout();