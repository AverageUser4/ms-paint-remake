import React, { useMemo } from "react";
import css from './Canvas.module.css';

import useResize from "../../hooks/useResize";
import useSelection from "./useSelection";
import useBrush from "./useBrush";
import useLine from "./useLine";
import { useCanvasContext } from "../../context/CanvasContext";
import { useCanvasMiscContext } from "../../context/CanvasMiscContext";
import { useHistoryContext } from "../../context/HistoryContext";
import { useToolContext } from "../../context/ToolContext";
import { useColorContext } from "../../context/ColorContext";
import { useContextMenuContext } from "../../context/ContextMenuContext";
import { useSelectionContext } from "../../context/SelectionContext";
import { useWindowsContext } from "../../context/WindowsContext";
import { RGBObjectToString, getGridData } from "../../misc/utils";
import { MAX_CANVAS_SIZE, cursorData } from "../../misc/data";

function Canvas() {
  const { 
    canvasSize, canvasZoom, setCanvasSize,
    primaryRef, secondaryRef, isBlackAndWhite,
    brushCanvasRef
  } = useCanvasContext();
  const { 
    canvasOutlineSize, setCanvasOutlineSize,
    setCanvasMousePosition 
  } = useCanvasMiscContext();
  const { currentTool, currentToolData } = useToolContext();
  const { colorData } = useColorContext();
  const { doHistoryAdd } = useHistoryContext();
  const { 
    selectionRef, selectionSize, selectionPhase, selectionPosition,
    doSelectionDrawToPrimary, doSelectionEnd,
  } = useSelectionContext();
  const { openContextMenu } = useContextMenuContext();
  const { isGridLinesVisible } = useWindowsContext();
  const gridData = getGridData(canvasZoom);
  const { onPointerDownBrush } = useBrush();

  const canvasStyle = useMemo(() => ({ 
    width: canvasSize.width * canvasZoom,
    height: canvasSize.height * canvasZoom,
    filter: isBlackAndWhite ? 'grayscale(100%)' : '',
  }), [canvasSize, canvasZoom, isBlackAndWhite]);
  const selectionStyle = {
    width: selectionSize?.width * canvasZoom,
    height: selectionSize?.height * canvasZoom,
    top: selectionPosition?.y * canvasZoom,
    left: selectionPosition?.x * canvasZoom,
  }

  const { 
    selectionResizeGrabElements, selectionResizeOutlineElement, onPointerDownSelectionMove,
    onPointerDownRectangularSelection, onPointerDownFreeFormSelection
  } = useSelection();

  const { onPointerDownLine, lineElements } = useLine();

  let onPointerDownSecondary = onPointerDownBrush;
  if(currentTool === 'shape-line') {
    onPointerDownSecondary = onPointerDownLine;
  } else if(currentTool === 'selection-free-form') {
    onPointerDownSecondary = onPointerDownFreeFormSelection;
  } else if(currentTool === 'selection-rectangle' || currentTool.startsWith('shape')) {
    onPointerDownSecondary = onPointerDownRectangularSelection;
  } 

  const { 
    resizeGrabElements: canvasResizeGrabElements,
    resizeOutlineElement: canvasResizeOutlineElement 
  } = useResize({ 
    position: { x: 0, y: 0 },
    setPosition: ()=>0,
    size: canvasOutlineSize || canvasSize,
    setSize: setCanvasOutlineSize,
    minimalSize: { width: 1, height: 1, },
    maximalSize: { 
      width: MAX_CANVAS_SIZE * canvasZoom,
      height: MAX_CANVAS_SIZE * canvasZoom 
    },
    canvasZoom,
    onPressEndCallback: onPointerUpCallbackResize,
    isAllowToLeaveViewport: true,
    isResizable: true,
    isPointBased: true,
    isOnlyThreeDirections: true,
    isCancelOnRightMouseDown: true,
  });

  function onPointerUpCallbackResize() {
    if(!canvasOutlineSize) {
      return;
    }

    let { width, height } = canvasOutlineSize;
    width = Math.round(width / canvasZoom);
    height = Math.round(height / canvasZoom);

    setCanvasSize({ width, height });
    setCanvasOutlineSize(null);
    doHistoryAdd({ element: primaryRef.current, width, height });
  }

  return (
    <div 
      id="pxp-direct-canvas-container"
      className="point-container"
    >
      <div style={canvasStyle}></div>

      <canvas
        id="pxp-primary-canvas"
        style={{ ...canvasStyle, backgroundColor: RGBObjectToString(colorData.secondary) }}
        className={`${css['canvas']} ${css['canvas--primary']}`}
        width={canvasSize.width}
        height={canvasSize.height}
        ref={primaryRef}
      ></canvas>

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

      {lineElements}

      {
        selectionPhase > 0 &&
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
      }

      {selectionPhase === 2 && !currentTool.startsWith('shape') && selectionResizeOutlineElement}

      {
        selectionPhase !== 2 && 
          <>
            {canvasResizeOutlineElement}
            {canvasResizeGrabElements}
          </>
      }

      <canvas
        className={`${css['canvas']} ${css['canvas--brush']}`}
        ref={brushCanvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        style={canvasStyle}
      />

      {
        /* https://codereview.stackexchange.com/questions/114702/drawing-a-grid-on-canvas */
        isGridLinesVisible &&
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
      }
    </div>
  );
}

export default Canvas;