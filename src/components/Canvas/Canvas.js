import React, { useEffect, useRef } from "react";
import css from './Canvas.module.css';

import useResize from "../../hooks/useResize";
import usePointerTrack from '../../hooks/usePointerTrack';
import { usePaintContext } from "../../misc/PaintContext";
import { RGBObjectToString } from "../../misc/utils";

function doGetCanvasCopy(canvasRef) {
  const newCanvas = document.createElement('canvas');
  newCanvas.width = canvasRef.current.width;
  newCanvas.height = canvasRef.current.height;
  newCanvas.getContext('2d').drawImage(canvasRef.current, 0, 0);
  return newCanvas;
}

function Canvas() {
  const { canvasData, setCanvasData, doHistoryAdd, history, colorData, toolsData, currentTool } = usePaintContext();
  const currentToolData = toolsData.get(currentTool);
  const canvasStyle = { 
    width: canvasData.size.width * canvasData.zoom,
    height: canvasData.size.height * canvasData.zoom,
  };
  let cursorClass;

  if(currentTool.startsWith('brushes')) {
    cursorClass = css['canvas--draw'];
  }
  switch(currentTool) {
    case 'pencil':
      cursorClass = css['canvas--pencil'];
      break;

    case 'fill':
      cursorClass = css['canvas--fill'];
      break;

    case 'color-picker':
      cursorClass = css['canvas--color-picker'];
      break;

    case 'brushes-airbrush':
      cursorClass = css['canvas--airbrush'];
      break;

    case 'text':
      cursorClass = css['canvas--text'];
      break;

    case 'zoom':
      cursorClass = css['canvas--zoom'];
      break;

    case 'eraser':
      cursorClass = css['canvas--none'];
      break;
  }

  const primaryRef = useRef();
  const primaryCtxRef = useRef();
  const secondaryRef = useRef();
  const secondaryCtxRef = useRef();
  const lastPointerPositionRef = useRef({});
  const lastPrimaryStateRef = useRef();
  const lastHistoryIndexRef = useRef(history.currentIndex);

  const { onPointerDown, currentylPressedRef } = usePointerTrack({ 
    onPointerMoveCallback: onPointerMoveCallbackMove,
    onPointerDownCallback: onPointerMoveCallbackMove,
    onPointerUpCallback: onPointerUpCallbackMove,
    onCancelCallback: onCancelCallbackMove,
    cancelOnRightMouseDown: true,
    isTrackAlsoRight: true
  });
  function onPointerMoveCallbackMove(event) {
    const step = currentTool === 'airbrush' ? 5 : 1;
    const secondaryRect = secondaryRef.current.getBoundingClientRect();
    let { x: curX, y: curY } = lastPointerPositionRef.current;
    
    const desX = (event.pageX - secondaryRect.x) / canvasData.zoom;
    const desY = (event.pageY - secondaryRect.y) / canvasData.zoom;
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

    secondaryCtxRef.current.fillStyle = currentylPressedRef.current === 0 ? RGBObjectToString(colorData.primary) : RGBObjectToString(colorData.secondary);
    secondaryCtxRef.current.strokeStyle = currentylPressedRef.current === 0 ? RGBObjectToString(colorData.primary) : RGBObjectToString(colorData.secondary);

    const theTool = toolsData.get(currentTool);
    theTool.draw({
      primaryContext: primaryCtxRef.current,
      secondaryContext: secondaryCtxRef.current,
      curX: Math.round(curX),
      curY: Math.round(curY),
      desX: Math.round(desX),
      desY: Math.round(desY),
      isRepeated: false,
      currentlyPressed: currentylPressedRef.current,
      color: { ...colorData }
    });

    while(Math.abs(curX - desX) > step || Math.abs(curY - desY) > step) {
      curX += step * propX;
      curY += step * propY;
      theTool.draw({
        primaryContext: primaryCtxRef.current,  
        secondaryContext: secondaryCtxRef.current,
        curX: Math.round(curX),
        curY: Math.round(curY),
        desX: Math.round(desX),
        desY: Math.round(desY),
        isRepeated: true,
        currentlyPressed: currentylPressedRef.current,
        color: { ...colorData }
      });
    }
  }
  function onPointerUpCallbackMove() {
    lastPointerPositionRef.current = {};

    primaryCtxRef.current.drawImage(secondaryRef.current, 0, 0);
    secondaryCtxRef.current.clearRect(0, 0, canvasData.size.width, canvasData.size.height);

    lastPrimaryStateRef.current = doGetCanvasCopy(primaryRef);
    doHistoryAdd({ 
      element: doGetCanvasCopy(primaryRef),
      width: canvasData.size.width,
      height: canvasData.size.height
    });
  }
  function onCancelCallbackMove() {
    lastPointerPositionRef.current = {};
    secondaryCtxRef.current.clearRect(0, 0, canvasData.size.width, canvasData.size.height);
  }

  const { resizeElements } = useResize({ 
    position: { x: 0, y: 0 },
    setPosition: ()=>0,
    isAllowToLeaveViewport: true,
    size: canvasData.outlineSize || canvasData.size,
    setSize: (newSize) => setCanvasData(prev => ({ ...prev, outlineSize: newSize })),
    isConstrained: false,
    minimalSize: { width: 1, height: 1, },
    isResizable: true,
    isPointBased: true,
    isOnlyThreeDirections: true,
    cancelOnRightMouseDown: true,
    onPointerUpCallback: onPointerUpCallbackResize
  });
  function onPointerUpCallbackResize() {
    setCanvasData(prev => ({ ...prev, outlineSize: null, size: prev.outlineSize }));
    doHistoryAdd({ 
      element: doGetCanvasCopy(primaryRef),
      width: canvasData.outlineSize.width,
      height: canvasData.outlineSize.height
    });
  }

  useEffect(() => {
    primaryCtxRef.current = primaryRef.current.getContext('2d');
    secondaryCtxRef.current = secondaryRef.current.getContext('2d');
  }, []);

  useEffect(() => {
    if(history.currentIndex === lastHistoryIndexRef.current) {
      return;
    }

    primaryCtxRef.current.clearRect(0, 0, 9999, 9999);
    primaryCtxRef.current.drawImage(history.dataArray[history.currentIndex].element, 0, 0);
    lastPrimaryStateRef.current = doGetCanvasCopy(primaryRef);
    setCanvasData(prev => ({ ...prev, size: { 
      width: history.dataArray[history.currentIndex].width,
      height: history.dataArray[history.currentIndex].height,
    }}));

    lastHistoryIndexRef.current = history.currentIndex;
  }, [history, setCanvasData]);

  useEffect(() => {
    if(lastPrimaryStateRef.current) {
      primaryCtxRef.current.clearRect(0, 0, canvasData.size.width, canvasData.size.height);
      primaryCtxRef.current.drawImage(lastPrimaryStateRef.current, 0, 0);
      // so the parts of image that end up outside the viewable are are cut off
      lastPrimaryStateRef.current = doGetCanvasCopy(primaryRef);
    }
  }, [canvasData.size]);

  return (
    <div className="point-container">
      <div style={canvasStyle}></div>

      <canvas
        style={canvasStyle}
        className={`${css['canvas']} ${css['canvas--primary']}`}
        width={canvasData.size.width}
        height={canvasData.size.height}
        ref={primaryRef}
      ></canvas>

      <canvas
        style={canvasStyle}
        className={`${css['canvas']} ${cursorClass}`}
        width={canvasData.size.width}
        height={canvasData.size.height}
        onPointerMove={(event) => {
          const { offsetX, offsetY } = event.nativeEvent;
          setCanvasData(prev => ({ ...prev, mousePosition: { x: offsetX, y: offsetY } }));
        }}
        onPointerLeave={() => setCanvasData(prev => ({ ...prev, mousePosition: null }))}
        onPointerDown={onPointerDown}
        ref={secondaryRef}
      ></canvas>

      {resizeElements}

      {
        currentTool === 'eraser' && canvasData.mousePosition &&
          <div
            className={css['eraser']}
            style={{ 
              left: Math.round(canvasData.mousePosition.x - currentToolData.sizes[currentToolData.chosenSizeIndex] / 2 * canvasData.zoom),
              top: Math.round(canvasData.mousePosition.y - currentToolData.sizes[currentToolData.chosenSizeIndex] / 2 * canvasData.zoom),
              backgroundColor: RGBObjectToString(colorData.secondary),
              width: Math.round(currentToolData.sizes[currentToolData.chosenSizeIndex] * canvasData.zoom),
              height: Math.round(currentToolData.sizes[currentToolData.chosenSizeIndex] * canvasData.zoom),
            }}
          ></div>
      }
    </div>
  );
}

export default Canvas;