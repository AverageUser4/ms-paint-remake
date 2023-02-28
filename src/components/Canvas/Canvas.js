import React, { useEffect, useRef } from "react";
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
  const { canvasSize, canvasOutlineSize, canvasZoom, setCanvasOutlineSize, setCanvasSize, canvasMousePosition, setCanvasMousePosition } = useCanvasContext();
  const { toolsData, currentTool } = useToolContext();
  const { colorData } = useColorContext()
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
  const tertiaryRef = useRef();
  const tertiaryCtxRef = useRef();
  const lastPointerPositionRef = useRef({});
  const lastPrimaryStateRef = useRef();
  const lastHistoryIndexRef = useRef(history.currentIndex);

  const { onPointerDown, currentlyPressedRef } = usePointerTrack({ 
    onPointerMoveCallback: !currentToolData.onPointerMove ? onPointerMoveCallbackMove :
      (event) => currentToolData.onPointerMove({ event }),
    onPointerDownCallback: !currentToolData.onPointerDown ? onPointerMoveCallbackMove : 
      (event) => currentToolData.onPointerDown({
        event,
        currentZoom: canvasZoom,
        primaryContext: primaryCtxRef.current,
        canvasSize: canvasSize,
        colorData
      }),
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
    onPointerUpCallback: onPointerUpCallbackResize
  });
  function onPointerUpCallbackResize() {
    setCanvasSize(canvasOutlineSize);
    setCanvasOutlineSize(null);
    doHistoryAdd({ 
      element: doGetCanvasCopy(primaryRef),
      width: canvasOutlineSize.width,
      height: canvasOutlineSize.height
    });
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

      {/* <canvas
        style={{ 
          ...canvasStyle,
          top: 50,
          left: 50,
          width: 50,
          height: 50
        }}
        className={`${css['canvas']} ${css['canvas--tertiary']}`}
      ></canvas> */}

      {resizeElements}

      {
        currentTool === 'eraser' && canvasMousePosition &&
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
      }
    </div>
  );
}

export default Canvas;