import React from "react";
import css from './Canvas.module.css';

import useResize from "../../hooks/useResize";
import useSelection from "./useSelection";
import useBrush from "./useBrush";
import { useCanvasContext } from "../../context/CanvasContext";
import { useCanvasMiscContext } from "../../context/CanvasMiscContext";
import { useHistoryContext } from "../../context/HistoryContext";
import { useToolContext } from "../../context/ToolContext";
import { useColorContext } from "../../context/ColorContext";
import { useContextMenuContext } from "../../context/ContextMenuContext";
import { useSelectionContext } from "../../context/SelectionContext";
import { useWindowsContext } from "../../context/WindowsContext";
import { RGBObjectToString, doGetCanvasCopy, doGetGridData } from "../../misc/utils";
import { MAX_CANVAS_SIZE } from "../../misc/data";

function Canvas() {
  const { 
    canvasSize, canvasZoom, setCanvasSize,
    primaryRef, secondaryRef, isBlackAndWhite,
  } = useCanvasContext();
  const { 
    canvasOutlineSize, setCanvasOutlineSize, canvasMousePosition,
    setCanvasMousePosition 
  } = useCanvasMiscContext();
  const { currentTool, currentToolData } = useToolContext();
  const { colorData } = useColorContext()
  const { doHistoryAdd } = useHistoryContext();
  const canvasStyle = { 
    width: canvasSize.width * canvasZoom,
    height: canvasSize.height * canvasZoom,
    filter: isBlackAndWhite ? 'grayscale(100%)' : '',
  };
  const { selectionRef, selectionSize, selectionPhase, selectionPosition } = useSelectionContext();
  const { openContextMenu } = useContextMenuContext();
  const { isGridLinesVisible } = useWindowsContext();
  const gridData = doGetGridData(canvasZoom);

  const { onPointerDownBrush } = useBrush();

  const { 
    selectionResizeElements, onPointerDownSelectionMove,
    onPointerDownRectangularSelection, onPointerDownFreeFormSelection
  } = useSelection();

  let onPointerDownSecondary = onPointerDownBrush;
  if(currentTool === 'selection-rectangle') {
    onPointerDownSecondary = onPointerDownRectangularSelection;
  } else if(currentTool === 'selection-free-form') {
    onPointerDownSecondary = onPointerDownFreeFormSelection;
  }

  const { resizeElements } = useResize({ 
    position: { x: 0, y: 0 },
    setPosition: ()=>0,
    size: canvasOutlineSize || canvasSize,
    setSize: setCanvasOutlineSize,
    minimalSize: { width: 1, height: 1, },
    maximalSize: { width: MAX_CANVAS_SIZE * canvasZoom, height: MAX_CANVAS_SIZE * canvasZoom },
    zoom: canvasZoom,
    onPointerUpCallback: onPointerUpCallbackResize,
    isConstrained: false,
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
    doHistoryAdd({ element: doGetCanvasCopy(primaryRef.current), width, height });
  }

  return (
    <div className="point-container">
      <div style={canvasStyle}></div>

      <canvas
        style={{ ...canvasStyle, backgroundColor: RGBObjectToString(colorData.secondary) }}
        className={`${css['canvas']} ${css['canvas--primary']}`}
        width={canvasSize.width}
        height={canvasSize.height}
        ref={primaryRef}
      ></canvas>

      <canvas
        style={canvasStyle}
        className={`${css['canvas']} ${css[`canvas--cursor-${currentToolData.cursor}`]}`}
        width={canvasSize.width}
        height={canvasSize.height}
        onPointerMove={(event) => {
          const { offsetX, offsetY } = event.nativeEvent;
          setCanvasMousePosition({ x: offsetX, y: offsetY });
        }}
        onPointerLeave={() => setCanvasMousePosition(null)}
        onPointerDown={(e) => onPointerDownSecondary(e)}
        onContextMenu={(e) => currentTool === 'selection-rectangle' && openContextMenu(e, 'canvas', 'primary')}
        ref={secondaryRef}
      ></canvas>

      {
        selectionPhase > 0 &&
          <div 
            className="point-container point-container--inner point-container--repositioned"
            style={{
              left: selectionPosition.x,
              top: selectionPosition.y,
              width: selectionSize.width,
              height: selectionSize.height
            }}
          >
            <canvas
              width={selectionSize.width}
              height={selectionSize.height}
              style={{ 
                ...canvasStyle,
                left: 0,
                top: 0,
                width: selectionSize.width,
                height: selectionSize.height
              }}
              className={`
                ${css['canvas']}
                ${css['canvas--selection']}
                ${selectionPhase === 2 && css['canvas--selection--ready']}
              `}
              onPointerDown={(e) => e.button === 0 && onPointerDownSelectionMove(e)}    
              onContextMenu={(e) => openContextMenu(e, 'canvas', 'selection')}
              ref={selectionRef}
            ></canvas>

            {selectionPhase === 2 && selectionResizeElements}
          </div>
      }

      {selectionPhase !== 2 && resizeElements}

      {
        currentTool === 'eraser' && canvasMousePosition &&
          <div className={css['eraser-container']}>
            <div
              className={css['eraser']}
              style={{ 
                left: Math.round(canvasMousePosition.x - currentToolData.sizes[currentToolData.chosenSizeIndex] / 2 * canvasZoom),
                top: Math.round(canvasMousePosition.y - currentToolData.sizes[currentToolData.chosenSizeIndex] / 2 * canvasZoom),
                backgroundColor: RGBObjectToString(colorData.secondary),
                width: Math.round(currentToolData.sizes[currentToolData.chosenSizeIndex] * canvasZoom),
                height: Math.round(currentToolData.sizes[currentToolData.chosenSizeIndex] * canvasZoom),
              }}
            ></div>
          </div>
      }

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