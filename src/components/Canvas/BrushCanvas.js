import React, { memo } from 'react';
import css from './Canvas.module.css';

import { useCanvasContext } from '../../context/CanvasContext';

const BrushCanvas = memo(function BrushCanvas() {
  const { brushCanvasRef, canvasSize, canvasStyle } = useCanvasContext();
  
  return (
    <canvas
      className={`${css['canvas']} ${css['canvas--brush']}`}
      ref={brushCanvasRef}
      width={canvasSize.width}
      height={canvasSize.height}
      style={canvasStyle}
    />
  );
});

export default BrushCanvas;