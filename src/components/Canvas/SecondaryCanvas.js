import React, { memo } from 'react';
import PropTypes from 'prop-types';
import css from './Canvas.module.css';

import { cursorData } from "../../misc/data";
import { useCanvasContext } from '../../context/CanvasContext';
import { useToolContext } from '../../context/ToolContext';
import { useSelectionContext } from '../../context/SelectionContext';
import { useCanvasMiscContext } from '../../context/CanvasMiscContext';
import { useContextMenuContext } from '../../context/ContextMenuContext';

const SecondaryCanvas = memo(function SecondaryCanvas({ onPointerDownSecondary }) {
  const { secondaryRef, canvasSize, canvasZoom, canvasStyle } = useCanvasContext();
  const { currentToolData, currentTool } = useToolContext();
  const { selectionPhase, doSelectionDrawToPrimary, doSelectionEnd } = useSelectionContext();
  const { openContextMenu } = useContextMenuContext();
  const { setCanvasMousePosition } = useCanvasMiscContext();
  
  return (
    <canvas
      style={{ 
        ...canvasStyle,
        cursor: cursorData?.[currentToolData?.cursor]?.[canvasZoom] || cursorData?.[currentToolData?.cursor]?.default
      }}
      className={`${css['canvas']}`}
      width={canvasSize.width}
      height={canvasSize.height}
      onPointerMove={(event) => {
        const { offsetX, offsetY } = event.nativeEvent;
        setCanvasMousePosition({ x: offsetX, y: offsetY });
      }}
      onPointerLeave={() => setCanvasMousePosition(null)}
      onPointerDown={(e) => onPointerDownSecondary(e)}
      onContextMenu={(e) => {
        if(currentTool !== 'selection-rectangle' || selectionPhase === 1) {
          return;
        }

        if(selectionPhase === 2) {
          doSelectionDrawToPrimary();
          doSelectionEnd();
        }

        openContextMenu(e, 'canvas', 'primary') 
      }}
      ref={secondaryRef}
    ></canvas>
  );
});

SecondaryCanvas.propTypes = {
  onPointerDownSecondary: PropTypes.func.isRequired,
};

export default SecondaryCanvas;