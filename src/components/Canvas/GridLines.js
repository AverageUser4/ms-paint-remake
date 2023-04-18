/* https://codereview.stackexchange.com/questions/114702/drawing-a-grid-on-canvas */
import React, { memo } from 'react';
import css from './Canvas.module.css';

import { useWindowsContext } from "../../context/WindowsContext";
import { getGridData } from "../../misc/utils";
import { useCanvasContext } from '../../context/CanvasContext';

const GridLines = memo(function GridLines() {
  const { canvasZoom, canvasStyle } = useCanvasContext();
  const { isGridLinesVisible } = useWindowsContext();
  const gridData = getGridData(canvasZoom);

  if(!isGridLinesVisible) {
    return null;
  }
  
  return (
    <svg 
      className={`
        ${css['canvas']}
        ${css['canvas--grid-lines']}
      `}
      width={canvasStyle.width}
      height={canvasStyle.height}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="smallGrid" width={gridData.cellSize} height={gridData.cellSize} patternUnits="userSpaceOnUse">
          <path 
            d={`M ${gridData.cellSize},0 L 0,0 0,${gridData.cellSize}`}
            fill="none"
            stroke={gridData.color_1}
            strokeWidth="2"
            strokeDasharray="1 1"
          />
          <path 
            d={`M ${gridData.cellSize},0 L 0,0 0,${gridData.cellSize}`}
            fill="none"
            stroke={gridData.color_2}
            strokeWidth="2"
            strokeDasharray="1 1"
            strokeDashoffset="1"
          />
        </pattern>
      </defs>

      <rect width="100%" height="100%" fill="url(#smallGrid)" />
    </svg>
  );
});

export default GridLines;