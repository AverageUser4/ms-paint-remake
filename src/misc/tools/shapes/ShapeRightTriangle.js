import ShapeBase from "./ShapeBase";
import validateToolArgs from "../validateToolArgs";

class ShapeRightTriangle extends ShapeBase {

  drawShape({ selectionContext, colorData, selectionSize, currentlyPressedRef, canvasZoom, shapeData }) {
    validateToolArgs(arguments, ['selectionContext', 'colorData', 'selectionSize', 'currentlyPressedRef', 'shapeData']);
    
    this.prepareAndDraw({ 
      selectionSize,
      currentlyPressedRef,
      colorData,
      selectionContext,
      canvasZoom,
      drawCallback: ({ start, endX, endY }) => {
        selectionContext.beginPath();
        selectionContext.moveTo(start, start);
        selectionContext.lineTo(start, endY);
        selectionContext.lineTo(endX, endY);
        selectionContext.closePath();
        shapeData.fill === 'solid' && selectionContext.fill();
        shapeData.outline === 'solid' && selectionContext.stroke();

        if(shapeData.fill === 'crayon') {
          selectionContext.drawImage(document.querySelector(`#pxp-texture-crayon`), 0, 0)
        }
      }
    });
  }

}

export default new ShapeRightTriangle();