import React, { useEffect, useRef, useState } from "react";
import css from './Canvas.module.css';

import useResize from "../../hooks/useResize";
import usePointerTrack from '../../hooks/usePointerTrack';
import { useCanvasContext } from "../../misc/CanvasContext";
import { useHistoryContext } from "../../misc/HistoryContext";
import { useToolContext } from "../../misc/ToolContext";
import { useColorContext } from "../../misc/ColorContext";
import { RGBObjectToString } from "../../misc/utils";

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
  const lastPointerPositionRef = useRef({});
  const lastPrimaryStateRef = useRef();
  const lastHistoryIndexRef = useRef(history.currentIndex);

  let usedMoveCallback = onPointerMoveCallbackMove;
  let usedDownCallback = onPointerMoveCallbackMove;

  if(currentToolData.onPointerMove) {
    usedMoveCallback = (event) => currentToolData.onPointerMove({ event });
  }
  if(currentToolData.onPointerDown) {
    usedDownCallback = (event) => currentToolData.onPointerDown({
      event,
      currentZoom: canvasZoom,
      primaryContext: primaryCtxRef.current,
      canvasSize: canvasSize,
      colorData,
      setColorData,
      canvasZoom,
      setCanvasZoom
    });
  }

  /* TEMPORARY */
  /* TEMPORARY */
  /* TEMPORARY */
  const [resizeData, setResizeData] = useState(null);
  const [selectionSize, setSelectionSize] = useState({ width: 0, height: 0 });
  const [selectionPosition, setSelectionPosition] = useState({ x: 50, y: 50 });
  if(currentTool === 'selection-rectangle') {
    usedDownCallback = (event) => {
      const { clientX, clientY } = event;
      const primaryRect = primaryRef.current.getBoundingClientRect();
      const offsetX = event.pageX - primaryRect.x;
      const offsetY = event.pageY - primaryRect.y;
      
      console.log(offsetX, offsetY)
      
      setResizeData({
        initialX: clientX,
        initialY: clientY,
        initialWidth: 0,
        initialHeight: 0,
      })
      setSelectionSize({ width: 0, height: 0 });
      setSelectionPosition({ x: offsetX, y: offsetY });
    };
    
    usedMoveCallback = (event) => {
      let { clientX, clientY } = event;
      const primaryRect = primaryRef.current.getBoundingClientRect();
      const offsetX = event.pageX - primaryRect.x;
      const offsetY = event.pageY - primaryRect.y;
  
      let diffX = clientX - resizeData.initialX;
      let diffY = clientY - resizeData.initialY;
  
      let newWidth = selectionSize.width;
      let newHeight = selectionSize.height;
      let newX = selectionPosition.x;
      let newY = selectionPosition.y;
  
      newWidth = resizeData.initialWidth + diffX;
      newHeight = resizeData.initialHeight + diffY;

      console.log(offsetX)
      
      if(newWidth < 0) {
        newWidth *= -1;
        newX = offsetX;
      }
      if(newHeight < 0) {
        newHeight *= -1;
        newY = offsetY;
      }
  
      setSelectionSize({ width: newWidth, height: newHeight });
      setSelectionPosition({ x: newX, y: newY });
    };
  }
  /* TEMPORARY */
  /* TEMPORARY */
  /* TEMPORARY */
  
  const { onPointerDown, currentlyPressedRef } = usePointerTrack({ 
    onPointerMoveCallback: usedMoveCallback,
    onPointerDownCallback: usedDownCallback,
    onPointerUpCallback: onPointerUpCallbackMove,
    onCancelCallback: onCancelCallbackMove,
    cancelOnRightMouseDown: true,
    isTrackAlsoRight: true
  });
  function onPointerMoveCallbackMove(event) {
    const step = currentTool === 'airbrush' ? 5 : 1;
    const secondaryRect = secondaryRef.current.getBoundingClientRect();
    let { x: curX, y: curY } = lastPointerPositionRef.current;
    
    const desX = (event.pageX - secondaryRect.x) / canvasZoom;
    const desY = (event.pageY - secondaryRect.y) / canvasZoom;
    lastPointerPositionRef.current = { x: desX, y: desY };

    if(typeof curX === 'undefined') {
      curX = desX;
      curY = desY;
    }

    const diffX = desX - curX;
    const diffY = desY - curY;

    let propX = diffX < 0 ? -1 : 1;
    let propY = diffY < 0 ? -1 : 1;
    
    if(Math.abs(diffX) < Math.abs(diffY)) {
      propX = propX * Math.abs(diffX / diffY);
    } else {
      propY = propY * Math.abs(diffY / diffX);
    }

    secondaryCtxRef.current.fillStyle = currentlyPressedRef.current === 0 ? RGBObjectToString(colorData.primary) : RGBObjectToString(colorData.secondary);
    secondaryCtxRef.current.strokeStyle = currentlyPressedRef.current === 0 ? RGBObjectToString(colorData.primary) : RGBObjectToString(colorData.secondary);

    currentToolData.draw({
      primaryContext: primaryCtxRef.current,
      secondaryContext: secondaryCtxRef.current,
      curX: Math.round(curX),
      curY: Math.round(curY),
      desX: Math.round(desX),
      desY: Math.round(desY),
      isRepeated: false,
      currentlyPressed: currentlyPressedRef.current,
      currentlyPressedRef,
      color: { ...colorData }
    });

    while(Math.abs(curX - desX) > step || Math.abs(curY - desY) > step) {
      curX += step * propX;
      curY += step * propY;
      currentToolData.draw({
        primaryContext: primaryCtxRef.current,  
        secondaryContext: secondaryCtxRef.current,
        curX: Math.round(curX),
        curY: Math.round(curY),
        desX: Math.round(desX),
        desY: Math.round(desY),
        isRepeated: true,
        currentlyPressed: currentlyPressedRef.current,
        currentlyPressedRef,
        color: { ...colorData }
      });
    }
  }
  function onPointerUpCallbackMove() {
    lastPointerPositionRef.current = {};

    primaryCtxRef.current.drawImage(secondaryRef.current, 0, 0);
    secondaryCtxRef.current.clearRect(0, 0, canvasSize.width, canvasSize.height);

    lastPrimaryStateRef.current = doGetCanvasCopy(primaryRef);
    doHistoryAdd({ 
      element: doGetCanvasCopy(primaryRef),
      width: canvasSize.width,
      height: canvasSize.height
    });
  }
  function onCancelCallbackMove() {
    lastPointerPositionRef.current = {};
    secondaryCtxRef.current.clearRect(0, 0, canvasSize.width, canvasSize.height);
  }

  const { resizeElements } = useResize({ 
    position: { x: 0, y: 0 },
    setPosition: ()=>0,
    isAllowToLeaveViewport: true,
    size: canvasOutlineSize || canvasSize,
    setSize: (newSize) => setCanvasOutlineSize(newSize),
    isConstrained: false,
    minimalSize: { width: 1, height: 1, },
    isResizable: true,
    isPointBased: true,
    isOnlyThreeDirections: true,
    cancelOnRightMouseDown: true,
    onPointerUpCallback: onPointerUpCallbackResize,
    zoom: canvasZoom
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
        onPointerDown={onPointerDown}
        ref={secondaryRef}
      ></canvas>

      <canvas
        style={{ 
          ...canvasStyle,
          left: selectionPosition.x,
          top: selectionPosition.y,
          width: selectionSize.width,
          height: selectionSize.height
        }}
        className={`${css['canvas']} ${css['canvas--selection']}`}
      ></canvas>

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