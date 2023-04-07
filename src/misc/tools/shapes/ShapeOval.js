import ShapeBase from "./ShapeBase";
import validateToolArgs from "../validateToolArgs";

class ShapeOval extends ShapeBase {

  drawShape({ selectionContext, colorData, selectionSize, currentlyPressedRef, canvasZoom, shapeData }) {
    validateToolArgs(arguments, ['selectionContext', 'colorData', 'selectionSize', 'currentlyPressedRef', 'shapeData']);
    
    this.prepareAndDraw({ 
      selectionSize,
      currentlyPressedRef,
      colorData,
      selectionContext,
      canvasZoom,
      shapeData,
      drawCallback: ({ context, startXY, middle }) => {
        context.beginPath();
        context.ellipse(
          middle.x, middle.y,
          Math.max(middle.x - startXY, 0),
          Math.max(middle.y - startXY, 0),
          0, 0, 2 * Math.PI
        );
        shapeData.fill && context.fill();
        shapeData.outline && context.stroke();
      }
    });
  }

}

export default new ShapeOval();