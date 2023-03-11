import React, { useEffect, useRef } from "react";
import css from './Canvas.module.css';

import useResize from "../../hooks/useResize";
import useSelection from "./useSelection";
import useBrush from "./useBrush";
import { useCanvasContext } from "../../misc/CanvasContext";
import { useHistoryContext } from "../../misc/HistoryContext";
import { useToolContext } from "../../misc/ToolContext";
import { useColorContext } from "../../misc/ColorContext";
import { useContextMenuContext } from "../../misc/ContextMenuContext";
import { useSelectionContext } from "../../misc/SelectionContext";
import { useWindowsContext } from "../../misc/WindowsContext";
import { RGBObjectToString, doGetCanvasCopy } from "../../misc/utils";
import { MAX_CANVAS_SIZE } from "../../misc/data";

function Canvas() {
  const { 
    canvasSize, canvasOutlineSize, canvasZoom, setCanvasZoom,
    setCanvasOutlineSize, setCanvasSize, canvasMousePosition,
    setCanvasMousePosition, primaryRef, secondaryRef, lastPrimaryStateRef,
    clearPrimary
  } = useCanvasContext();
  const { toolsData, currentTool } = useToolContext();
  const { colorData, setColorData } = useColorContext()
  const { doHistoryAdd } = useHistoryContext();
  const currentToolData = toolsData.get(currentTool);
  const canvasStyle = { 
    width: canvasSize.width * canvasZoom,
    height: canvasSize.height * canvasZoom,
  };
  const { 
    selectionRef, selectionSize, selectionPhase, selectionPosition,
  } = useSelectionContext();
  const { openContextMenu } = useContextMenuContext();
  const { isGridLinesVisible } = useWindowsContext();
  
  const lastPointerPositionRef = useRef({});
  const lastCurrentToolRef = useRef();
  const lastCanvasZoomRef = useRef();
  const isFirstRenderRef = useRef(true);
  const lastCanvasSizeRef = useRef(canvasSize);
  const gridLinesRef = useRef();

  const {
    onPointerDownBrush
  } = useBrush({
    currentTool, lastPointerPositionRef, canvasZoom,
    colorData, currentToolData,
    doHistoryAdd, canvasSize,
    setColorData, setCanvasZoom,
  });

  const { 
    selectionResizeElements, onPointerDownSelectionMove,
    onPointerDownRectangularSelection, onPointerDownFreeFormSelection
  } = useSelection({
    currentTool, selectionRef,
    canvasZoom, lastCurrentToolRef,
    lastCanvasZoomRef, colorData,
    lastPointerPositionRef,
    lastPrimaryStateRef,
    currentToolData,
    canvasSize,
  });

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

  useEffect(() => {
    // by default canvas background is transparent, in paint it is supposed to always be in secondary color
    if(!isFirstRenderRef.current) {
      return;
    }
    isFirstRenderRef.current = false;

    clearPrimary();
  }, [colorData.secondary, clearPrimary, canvasSize]);

  useEffect(() => {
    // changing width or height attribute (which happens whenever canvasSize changes)
    // of canvas causes it to lose its entire context (both 'settings' like
    // fillStyle and pixels drawn to it), this effect makes sure that after every change
    // to canvas' dimensions its latest pixels are put back on it
    if(lastCanvasSizeRef.current === canvasSize) {
      return;
    }
    lastCanvasSizeRef.current = canvasSize;
    
    const primaryContext = primaryRef.current.getContext('2d');
    clearPrimary();
    
    if(lastPrimaryStateRef.current) {
      primaryContext.drawImage(lastPrimaryStateRef.current, 0, 0);
      // so the parts of image that end up outside the viewable are are cut off
      lastPrimaryStateRef.current = doGetCanvasCopy(primaryRef.current);
    }
  }, [canvasSize, colorData.secondary, primaryRef, lastPrimaryStateRef, clearPrimary]);

  useEffect(() => {
    if(!isGridLinesVisible) {
      return;
    }
    
    const gridLinesContext = gridLinesRef.current.getContext('2d');
    
    // gridLinesContext.fillRect(10,10,1,1)
    // gridLinesContext.beginPath();
    // gridLinesContext.moveTo(10, 15.5);
    // gridLinesContext.lineTo(20, 15.5);
    // gridLinesContext.stroke();
    
    gridLinesContext.save();

    for(let y = 0; y < canvasStyle.height; y += 10) {
      gridLinesContext.strokeStyle = 'red';
      gridLinesContext.lineWidth = 1;
      gridLinesContext.beginPath();
      gridLinesContext.setLineDash([1, 1]);
      gridLinesContext.moveTo(0, y + 0.5);
      gridLinesContext.lineTo(canvasStyle.width, y + 0.5);
      gridLinesContext.stroke();
      
      gridLinesContext.strokeStyle = 'blue';
      gridLinesContext.beginPath();
      gridLinesContext.setLineDash([1, 1]);
      gridLinesContext.moveTo(1, y + 0.5);
      gridLinesContext.lineTo(canvasStyle.width, y + 0.5);
      gridLinesContext.stroke();
    }
    
    for(let x = 0; x < canvasStyle.width; x += 10) {
      gridLinesContext.strokeStyle = 'red';
      gridLinesContext.lineWidth = 1;
      gridLinesContext.beginPath();
      gridLinesContext.setLineDash([1, 1]);
      gridLinesContext.moveTo(x + 0.5, 0);
      gridLinesContext.lineTo(x + 0.5, canvasStyle.height);
      gridLinesContext.stroke();
      
      gridLinesContext.strokeStyle = 'blue';
      gridLinesContext.beginPath();
      gridLinesContext.setLineDash([1, 1]);
      gridLinesContext.moveTo(x + 0.5, 1);
      gridLinesContext.lineTo(x + 0.5, canvasStyle.height);
      gridLinesContext.stroke();
    }
    
    gridLinesContext.restore();

  }, [isGridLinesVisible, canvasStyle.width, canvasStyle.height]);
 
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
              ref={(element) => { 
                selectionRef.current = element;
              }}
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
        isGridLinesVisible &&
          <canvas
            className={`
              ${css['canvas']}
              ${css['canvas--grid-lines']}
            `}
            width={canvasStyle.width}
            height={canvasStyle.height}
            ref={gridLinesRef}
          ></canvas>
      }
    </div>
  );
}

export default Canvas;