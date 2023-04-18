import React, { memo } from 'react';
import PropTypes from 'prop-types';
import css from './Canvas.module.css';

import { useCanvasContext } from '../../context/CanvasContext';
import { useSelectionContext } from '../../context/SelectionContext';
import { useToolContext } from '../../context/ToolContext';
import { useContextMenuContext } from '../../context/ContextMenuContext';

const SelectionCanvas = memo(function SelectionCanvas({ 
  onPointerDownSelectionMove,
  selectionResizeGrabElements,
  selectionResizeOutlineElement
}) {
  const { canvasZoom, canvasStyle } = useCanvasContext();
  const { 
    selectionPhase, selectionSize, selectionPosition, selectionRef,
  } = useSelectionContext();
  const { currentTool } = useToolContext();
  const { openContextMenu } = useContextMenuContext();

  const selectionStyle = {
    width: selectionSize?.width * canvasZoom,
    height: selectionSize?.height * canvasZoom,
    top: selectionPosition?.y * canvasZoom,
    left: selectionPosition?.x * canvasZoom,
  };
  
  if(!selectionPhase) {
    return null;
  }
  
  return (
    <>
      <div 
        className="point-container point-container--inner point-container--repositioned"
        style={{
          ...selectionStyle,
          display: (selectionPhase === 2 || selectionSize.width > 1 || selectionSize.height > 1) ? 'block' : 'none'
        }}
      >
        <canvas
          id="pxp-selection-canvas"
          width={selectionSize.width}
          height={selectionSize.height}
          style={{ 
            ...canvasStyle,
            ...selectionStyle,
            left: 0,
            top: 0,
          }}
          className={`
            ${css['canvas']}
            ${css['canvas--selection']}
            ${(selectionPhase === 1 && currentTool.startsWith('shape')) ? css['canvas--selection--shape'] : ''}
            ${selectionPhase === 2 && css['canvas--selection--ready']}
          `}
          onPointerDown={(e) => e.button === 0 && onPointerDownSelectionMove(e)}    
          onContextMenu={(e) => {
            if(selectionPhase === 1) {
              return;
            }
            openContextMenu(e, 'canvas', 'selection');
          }}
          ref={selectionRef}
        ></canvas>

        {selectionPhase === 2 && selectionResizeGrabElements}
      </div>

      {selectionPhase === 2 && !currentTool.startsWith('shape') && selectionResizeOutlineElement}
    </>
  );
});

SelectionCanvas.propTypes = {
  onPointerDownSelectionMove: PropTypes.func.isRequired,
  selectionResizeGrabElements: PropTypes.node,
  selectionResizeOutlineElement: PropTypes.node,
};

export default SelectionCanvas;