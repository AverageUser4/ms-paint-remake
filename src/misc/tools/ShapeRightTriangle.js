import ShapeBase from "./ShapeBase";
import validateToolArgs from "./validateToolArgs";

class ShapeRightTriangle extends ShapeBase {

  drawShape({ selectionContext, colorData, selectionSize, currentlyPressedRef }) {
    validateToolArgs(arguments, ['selectionContext', 'colorData', 'selectionSize', 'currentlyPressedRef']);

    const { start, endX, endY } = this.getCanvasData({ 
      selectionSize, currentlyPressedRef, colorData, selectionContext 
    });
    
    selectionContext.beginPath();
    selectionContext.moveTo(start, start);
    selectionContext.lineTo(start, endY);
    selectionContext.lineTo(endX, endY);
    selectionContext.closePath();
    selectionContext.stroke();
  }

}

export default new ShapeRightTriangle();