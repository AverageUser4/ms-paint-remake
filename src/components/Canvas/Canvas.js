import React, { useEffect, useRef, useState } from "react";
import css from './Canvas.module.css';

import useResize from "../../hooks/useResize";
import useMove from "../../hooks/useMove";
import usePointerTrack from '../../hooks/usePointerTrack';
import { useCanvasContext } from "../../misc/CanvasContext";
import { useHistoryContext } from "../../misc/HistoryContext";
import { useToolContext } from "../../misc/ToolContext";
import { useColorContext } from "../../misc/ColorContext";
import { RGBObjectToString } from "../../misc/utils";
import useResizeCursor from "../../hooks/useResizeCursor";

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

  let usedMoveCallback = onPointerMoveCallbackMove;
  let usedDownCallback = onPointerMoveCallbackMove;
  let usedUpCallback = onPointerUpCallbackMove;
  let usedCancelCallback = onCancelCallbackMove;

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
  if(currentToolData.onPointerUp) {
    usedUpCallback = (event) => currentToolData.onPointerUp({ event });
  }
  if(currentToolData.onCancel) {
    usedCancelCallback = (event) => currentToolData.onCancel({ event });
  }

  /* TEMPORARY */
  /* TEMPORARY */
  /* TEMPORARY */
  const [selectionResizeData, setSelectionResizeData] = useState(null);
  const [selectionSize, setSelectionSize] = useState({ width: 1, height: 1 });
  const [selectionResizedSize, setSelectionResizedSize] = useState({ width: 1, height: 1 });
  const [selectionPosition, setSelectionPosition] = useState({ x: 50, y: 50 });
  const [selectionOutlineSize, setSelectionOutlineSize] = useState(null);
  // 0, 1 or 2
  const [selectionPhase, setSelectionPhase] = useState(0);
  const lastSelectionStateRef = useRef();
  useResizeCursor(selectionResizeData);

  if(currentTool === 'selection-rectangle') {
    usedDownCallback = (event) => {
      if(selectionPhase === 2) {
        primaryCtxRef.current.imageSmoothingEnabled = false;
        primaryCtxRef.current.drawImage(
          doGetCanvasCopy(selectionRef),
          Math.round(selectionPosition.x / canvasZoom),
          Math.round(selectionPosition.y / canvasZoom),
          Math.round(selectionResizedSize.width / canvasZoom),
          Math.round(selectionResizedSize.height / canvasZoom),
        );
        doCancel();
        return;
      }
      
      const { clientX, clientY } = event;
      const primaryRect = primaryRef.current.getBoundingClientRect();
      const offsetX = event.pageX - primaryRect.x;
      const offsetY = event.pageY - primaryRect.y;
      
      setSelectionResizeData({
        type: 'selection',
        initialX: clientX,
        initialY: clientY,
        initialOffsetX: offsetX,
        initialOffsetY: offsetY,
        initialWidth: 1,
        initialHeight: 1,
      })
      setSelectionSize({ width: 1, height: 1 });
      setSelectionResizedSize({ width: 1, height: 1 });
      setSelectionPosition({ x: offsetX, y: offsetY });
      setSelectionPhase(1);
    };
    
    usedMoveCallback = (event) => {
      let { clientX, clientY } = event;
      const primaryRect = primaryRef.current.getBoundingClientRect();
      const offsetX = event.pageX - primaryRect.x;
      const offsetY = event.pageY - primaryRect.y;
  
      let diffX = clientX - selectionResizeData.initialX;
      let diffY = clientY - selectionResizeData.initialY;
  
      let newWidth = selectionSize.width;
      let newHeight = selectionSize.height;
      let newX = selectionPosition.x;
      let newY = selectionPosition.y;

      newWidth = selectionResizeData.initialWidth + diffX;
      newHeight = selectionResizeData.initialHeight + diffY;
      
      if(newWidth < 0) {
        newWidth *= -1;
        newWidth = Math.min(newWidth, selectionResizeData.initialOffsetX);
        newX = Math.max(offsetX, 0);
      } else {
        newX = selectionResizeData.initialOffsetX;
        newWidth = Math.min(newWidth, primaryRect.width - newX);
      }
      if(newHeight < 0) {
        newHeight *= -1;
        newHeight = Math.min(newHeight, selectionResizeData.initialOffsetY);
        newY = Math.max(offsetY, 0);
      } else {
        newY = selectionResizeData.initialOffsetY;
        newHeight = Math.min(newHeight, primaryRect.height - newY);
      }

      newWidth = Math.max(newWidth, 1);
      newHeight = Math.max(newHeight, 1);
  
      setSelectionSize({ width: newWidth, height: newHeight });
      setSelectionResizedSize({ width: newWidth, height: newHeight });

      if(newX !== selectionPosition.x || newY !== selectionPosition.y) {
        setSelectionPosition({ x: newX, y: newY });
      }
    };

    usedUpCallback = (event) => {
      if(
          selectionResizeData.initialX === event.clientX &&
          selectionResizeData.initialY === event.clientY
        ) {
        setSelectionPhase(0);
        return;
      }
      
      setSelectionPhase(2);
      setSelectionResizeData(null);
      const imageData = primaryCtxRef.current.getImageData(
        Math.round(selectionPosition.x / canvasZoom),
        Math.round(selectionPosition.y / canvasZoom),
        Math.round(selectionSize.width / canvasZoom),
        Math.round(selectionSize.height / canvasZoom),
      );

      selectionCtxRef.current.imageSmoothingEnabled = false;
      selectionCtxRef.current.scale(canvasZoom, canvasZoom);
      selectionCtxRef.current.putImageData(imageData, 0, 0);
      lastSelectionStateRef.current = doGetCanvasCopy(selectionRef);

      primaryCtxRef.current.fillStyle = 'red'//RGBObjectToString(colorData.secondary);
      primaryCtxRef.current.fillRect(
        Math.round(selectionPosition.x / canvasZoom),
        Math.round(selectionPosition.y / canvasZoom),
        Math.round(selectionSize.width / canvasZoom),
        Math.round(selectionSize.height / canvasZoom),
      );
    };

    usedCancelCallback = () => {
      setSelectionPhase(0);
      setSelectionResizeData(null);
    };
  }

  function onPointerUpCallbackSelectionResize() {
    if(!selectionOutlineSize) {
      return;
    }

    setSelectionResizedSize(selectionOutlineSize);
    setSelectionOutlineSize(null);
  }

  useEffect(() => {
    if(selectionPhase === 2 && lastSelectionStateRef.current) {
      selectionCtxRef.current.drawImage(lastSelectionStateRef.current, 0, 0);
    }
  }, [selectionSize, selectionPhase]);
  
  useEffect(() => {
    if(
        lastCurrentToolRef.current === currentTool &&
        lastCanvasZoomRef.current === canvasZoom
      ) {
      return;
    }

    lastCurrentToolRef.current = currentTool;
    lastCanvasZoomRef.current = canvasZoom;
    
    if(selectionPhase === 2) {
      primaryCtxRef.current.imageSmoothingEnabled = false;
      primaryCtxRef.current.drawImage(
        doGetCanvasCopy(selectionRef),
        selectionPosition.x,
        selectionPosition.y,
        selectionResizedSize.width,
        selectionResizedSize.height,
      );
    }
    setSelectionPhase(0);
  }, [currentTool, canvasZoom, selectionPosition, selectionPhase, selectionResizedSize]);

  const { resizeElements: selectionResizeElements } = useResize({ 
    position: selectionPosition,
    setPosition: setSelectionPosition,
    isAllowToLeaveViewport: true,
    size: selectionOutlineSize || selectionResizedSize,
    setSize: setSelectionOutlineSize,
    isConstrained: false,
    minimalSize: { width: 1, height: 1, },
    isResizable: true,
    isPointBased: true,
    isOnlyThreeDirections: false,
    isCancelOnRightMouseDown: true,
    onPointerUpCallback: onPointerUpCallbackSelectionResize,
    zoom: 1,
    containerRef: primaryRef
  });
  const { onPointerDownMove } = useMove({
    position: selectionPosition,
    setPosition: setSelectionPosition,
    size: selectionSize,
    setSize: (newSize) => { setSelectionSize(newSize); setSelectionResizedSize(newSize); },
    isInnerWindow: false,
    isMaximized: false,
    isConstrained: false,
    isReverseConstrained: true,
    containerRef: primaryRef,
  });
  /* TEMPORARY */
  /* TEMPORARY */
  /* TEMPORARY */
  
  const { onPointerDown, currentlyPressedRef, doCancel } = usePointerTrack({ 
    onPointerMoveCallback: usedMoveCallback,
    onPointerDownCallback: usedDownCallback,
    onPointerUpCallback: usedUpCallback,
    onCancelCallback: usedCancelCallback,
    isCancelOnRightMouseDown: true,
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
        onPointerDown={onPointerDown}
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