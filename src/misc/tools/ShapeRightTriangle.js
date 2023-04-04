import validateDrawArgs from "./validateDrawArgs";

export default {
  cursor: 'selection',
  sizes: [1, 3, 5, 8],
  chosenSize: 5,

  drawShape({ selectionContext, color, selectionSize }) {
    validateDrawArgs({ selectionContext, color, selectionSize,
      toBeValidatedArray: ['selectionContext', 'color', 'selectionSize']
    });

    const { width, height } = selectionSize;
    const start = this.chosenSize / 2;
    const endX = width - this.chosenSize / 2;
    const endY = height - this.chosenSize / 2;
    
    selectionContext.save();
    selectionContext.strokeStyle = color.primary;
    selectionContext.lineWidth = this.chosenSize;
    
    selectionContext.beginPath();
    selectionContext.moveTo(start, start);
    selectionContext.lineTo(start, endY);
    selectionContext.lineTo(endX, endY);
    selectionContext.closePath();
    selectionContext.stroke();

    selectionContext.restore();
  },

  onPointerDown({ event }) {
    // console.log('hi')
  },

  onPointerMove({ event }) {
    // console.log('hello')
  }
};