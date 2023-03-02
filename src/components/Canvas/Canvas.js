import React, { useEffect, useRef } from "react";
import css from './Canvas.module.css';

import useResize from "../../hooks/useResize";
import { useCanvasContext } from "../../misc/CanvasContext";
import { useHistoryContext } from "../../misc/HistoryContext";
import { useToolContext } from "../../misc/ToolContext";
import { useColorContext } from "../../misc/ColorContext";
import { RGBObjectToString } from "../../misc/utils";
import useSelection from "./useSelection";
import useBrush from "./useBrush";

function doGetCanvasCopy(canvasRef) {
  const newCanvas = document.createElement('canvas');
  newCanvas.width = canvasRef.current.width;
  newCanvas.height = canvasRef.current.height;
  newCanvas.getContext('2d').drawImage(canvasRef.current, 0, 0);
  return newCanvas;
}

function Canvas() {
  const { 
    canvasSize,
    canvasOutlineSize,
    canvasZoom,
    setCanvasZoom,
    setCanvasOutlineSize,
    setCanvasSize,
    canvasMousePosition,
    setCanvasMousePosition
  } = useCanvasContext();
  const { toolsData, currentTool } = useToolContext();
  const { colorData, setColorData } = useColorContext()
  const { history, doHistoryAdd } = useHistoryContext();
  const currentToolData = toolsData.get(currentTool);
  const canvasStyle = { 
    width: canvasSize.width * canvasZoom,
    height: canvasSize.height * canvasZoom,
  };

  const primaryRef = useRef();
  const primaryCtxRef = useRef();
  const secondaryRef = useRef();
  const secondaryCtxRef = useRef();
  const selectionRef = useRef();
  const selectionCtxRef = useRef();
  const lastPointerPositionRef = useRef({});
  const lastPrimaryStateRef = useRef();
  const lastHistoryIndexRef = useRef(history.currentIndex);
  const lastCurrentToolRef = useRef();
  const lastCanvasZoomRef = useRef();

  const {
    onPointerDownBrush
  } = useBrush({
    currentTool,
    secondaryRef,
    lastPointerPositionRef,
    canvasZoom,
    secondaryCtxRef,
    colorData,
    currentToolData,
    primaryCtxRef,
    lastPrimaryStateRef,
    doHistoryAdd,
    doGetCanvasCopy,
    canvasSize,
    primaryRef,
    setColorData,
    setCanvasZoom,
  });

  const { 
    selectionPhase,
    selectionPosition,
    selectionResizeElements,
    selectionResizedSize,
    selectionSize,
    onPointerDownMove,
    onPointerDownSelection
  } = useSelection({
    currentTool,
    primaryCtxRef,
    doGetCanvasCopy,
    selectionRef,
    canvasZoom,
    primaryRef,
    selectionCtxRef,
    lastCurrentToolRef,
    lastCanvasZoomRef,
  });

  const { resizeElements } = useResize({ 
    position: { x: 0, y: 0 },
    setPosition: ()=>0,
    isAllowToLeaveViewport: true,
    size: canvasOutlineSize || canvasSize,
    setSize: setCanvasOutlineSize,
    isConstrained: false,
    minimalSize: { width: 1, height: 1, },
    isResizable: true,
    isPointBased: true,
    isOnlyThreeDirections: true,
    isCancelOnRightMouseDown: true,
    onPointerUpCallback: onPointerUpCallbackResize,
    zoom: canvasZoom,
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
    doHistoryAdd({ element: doGetCanvasCopy(primaryRef), width, height });
  }

  useEffect(() => {
    if(primaryCtxRef.current) {
      return;
    }

    primaryCtxRef.current = primaryRef.current.getContext('2d');
    secondaryCtxRef.current = secondaryRef.current.getContext('2d');
    primaryCtxRef.current.fillStyle = RGBObjectToString(colorData.secondary);
    primaryCtxRef.current.fillRect(0, 0, 9999, 9999);
  }, [colorData.secondary]);

  useEffect(() => {
    if(history.currentIndex === lastHistoryIndexRef.current) {
      return;
    }

    primaryCtxRef.current.fillStyle = RGBObjectToString(colorData.secondary);
    primaryCtxRef.current.fillRect(0, 0, 99999, 99999);
    primaryCtxRef.current.drawImage(history.dataArray[history.currentIndex].element, 0, 0);
    lastPrimaryStateRef.current = doGetCanvasCopy(primaryRef);
    setCanvasSize({
      width: history.dataArray[history.currentIndex].width,
      height: history.dataArray[history.currentIndex].height,
    })

    lastHistoryIndexRef.current = history.currentIndex;
  }, [history, setCanvasSize, colorData.secondary]);

  useEffect(() => {
    if(lastPrimaryStateRef.current) {
      primaryCtxRef.current.fillStyle = RGBObjectToString(colorData.secondary);
      primaryCtxRef.current.fillRect(0, 0, canvasSize.width, canvasSize.height);
      primaryCtxRef.current.drawImage(lastPrimaryStateRef.current, 0, 0);
      // so the parts of image that end up outside the viewable are are cut off
      lastPrimaryStateRef.current = doGetCanvasCopy(primaryRef);
    }
  }, [canvasSize, colorData.secondary]);

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
        onPointerDown={currentTool.startsWith('selection') ? onPointerDownSelection : onPointerDownBrush}
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
              onPointerDown={onPointerDownMove}
              ref={(element) => { 
                selectionRef.current = element;
                selectionCtxRef.current = element?.getContext('2d');
              }}
            ></canvas>

            {selectionPhase === 2 && selectionResizeElements}
          </div>
      }

      {resizeElements}

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