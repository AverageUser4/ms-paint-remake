import React, { memo } from 'react';
import css from './Canvas.module.css';

import { RGBObjectToString } from "../../misc/utils";
import { useCanvasContext } from '../../context/CanvasContext';
import { useColorContext } from '../../context/ColorContext';

const PrimaryCanvas = memo(function PrimaryCanvas() {
  const { canvasSize, primaryRef, canvasStyle } = useCanvasContext();
  const { colorData } = useColorContext();
  
  return (
    <canvas
      id="pxp-primary-canvas"
      style={{ 
        ...canvasStyle,
        backgroundColor: RGBObjectToString(colorData.secondary),
      }}
      className={`${css['canvas']} ${css['canvas--primary']}`}
      width={canvasSize.width}
      height={canvasSize.height}
      ref={primaryRef}
    ></canvas>
  );
});

export default PrimaryCanvas;