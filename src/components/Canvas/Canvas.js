import React, { useEffect, useRef } from "react";
import css from './Canvas.module.css';

import useResize from "../../hooks/useResize";
import useSelection from "./useSelection";
import useBrush from "./useBrush";
import { useCanvasContext } from "../../misc/CanvasContext";
import { useHistoryContext } from "../../misc/HistoryContext";
import { useToolContext } from "../../misc/ToolContext";
import { useColorContext } from "../../misc/ColorContext";
import { useSelectionContext } from "../../misc/SelectionContext";
import { RGBObjectToString, doGetCanvasCopy } from "../../misc/utils";

function Canvas() {
  const { 
    canvasSize, canvasOutlineSize, canvasZoom, setCanvasZoom,
    setCanvasOutlineSize, setCanvasSize, canvasMousePosition,
    setCanvasMousePosition, primaryRef, secondaryRef, lastPrimaryStateRef,
  } = useCanvasContext();
  const { toolsData, currentTool } = useToolContext();
  const { colorData, setColorData } = useColorContext()
  const { history, doHistoryAdd } = useHistoryContext();
  const currentToolData = toolsData.get(currentTool);
  const canvasStyle = { 
    width: canvasSize.width * canvasZoom,
    height: canvasSize.height * canvasZoom,
  };

  const { 
    selectionRef, selectionResizedSize,
    selectionSize,selectionPhase, selectionPosition,
  } = useSelectionContext();
  
  const lastPointerPositionRef = useRef({});
  const lastHistoryIndexRef = useRef(history.currentIndex);
  const lastCurrentToolRef = useRef();
  const lastCanvasZoomRef = useRef();
  const isFirstRenderRef = useRef(true);

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

    const primaryContext = primaryRef.current.getContext('2d');
    primaryContext.fillStyle = RGBObjectToString(colorData.secondary);
    primaryContext.fillRect(0, 0, 9999, 9999);
  }, [colorData.secondary, primaryRef]);

  useEffect(() => {
    // when history.currentIndex changes, change canvas state to that point in history
    if(history.currentIndex === lastHistoryIndexRef.current) {
      return;
    }

    const primaryContext = primaryRef.current.getContext('2d');
    primaryContext.fillStyle = RGBObjectToString(colorData.secondary);
    primaryContext.fillRect(0, 0, 9999, 9999);
    primaryContext.drawImage(history.dataArray[history.currentIndex].element, 0, 0);
    lastPrimaryStateRef.current = doGetCanvasCopy(primaryRef.current);

    setCanvasSize({
      width: history.dataArray[history.currentIndex].width,
      height: history.dataArray[history.currentIndex].height,
    })

    lastHistoryIndexRef.current = history.currentIndex;
  }, [history, setCanvasSize, colorData.secondary, lastPrimaryStateRef, primaryRef]);

  useEffect(() => {
    // changing width or height attribute (which happens whenever canvasSize changes)
    // of canvas causes it to lose its entire context (both 'settings' like
    // fillStyle and pixels drawn to it), this effect makes sure that after every change
    // to canvas' dimensions its latest pixels are put back on it
    if(lastPrimaryStateRef.current) {
      const primaryContext = primaryRef.current.getContext('2d');
      primaryContext.fillStyle = RGBObjectToString(colorData.secondary);
      primaryContext.fillRect(0, 0, canvasSize.width, canvasSize.height);
      primaryContext.drawImage(lastPrimaryStateRef.current, 0, 0);
      // so the parts of image that end up outside the viewable are are cut off
      lastPrimaryStateRef.current = doGetCanvasCopy(primaryRef.current);
    }
  }, [canvasSize, colorData.secondary, primaryRef, lastPrimaryStateRef]);

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
        ref={secondaryRef}
      ></canvas>

      {
        selectionPhase > 0 &&
          <div 
            className="point-container point-container--inner point-container--repositioned"
            style={{
              left: selectionPosition.x,
              top: selectionPosition.y,
              width: selectionResizedSize.width,
              height: selectionResizedSize.height
            }}
          >
            <canvas
              width={selectionSize.width}
              height={selectionSize.height}
              style={{ 
                ...canvasStyle,
                left: 0,
                top: 0,
                width: selectionResizedSize.width,
                height: selectionResizedSize.height
              }}
              className={`
                ${css['canvas']}
                ${css['canvas--selection']}
                ${selectionPhase === 2 && css['canvas--selection--ready']}
              `}
              onPointerDown={(e) => onPointerDownSelectionMove(e)}
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
    </div>
  );
}

export default Canvas;