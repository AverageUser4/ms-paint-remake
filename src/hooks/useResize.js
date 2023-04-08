import React, { useState } from "react";
import useResizeCursor from './useResizeCursor';
import usePointerTrack from './usePointerTrack';
import { checkArgs } from "../misc/utils";

export default function useResize({
  containerRect,
  containerRef,
  minimalSize,
  maximalSize,
  position, 
  setPosition, 
  size, 
  setSize,
  canvasZoom = 1,
  onPressEndCallback,
  isConstrained,
  isResizable,
  isAllowToLeaveViewport,
  isOnlyThreeDirections,
  isPointBased,
  isCancelOnRightMouseDown,
  isSmallPoints,
}) {
  checkArgs([
    { name: 'minimalSize', value: minimalSize, type: 'object' },
    { name: 'position', value: position, type: 'object' },
    { name: 'setPosition', value: setPosition, type: 'function' },
    { name: 'size', value: size, type: 'object' },
    { name: 'setSize', value: setSize, type: 'function' },
    { name: 'isConstrained', value: isConstrained, type: 'boolean' },
    { name: 'isResizable', value: isResizable, type: 'boolean' },
    { name: 'isAllowToLeaveViewport', value: isAllowToLeaveViewport, type: 'boolean' },
  ]);

  const [resizeData, setResizeData] = useState(null);
  const [hasMoved, setHasMoved] = useState(false);
  useResizeCursor(resizeData);
  const type = isPointBased ? 'point' : 'resize';
  const sizeClass = isSmallPoints ? 'point-small' : '';

  const { onPointerDown: onPointerDownResize, isPressed } = 
    usePointerTrack({ 
      onPressedMoveCallback: onPressedMoveCallback,
      onPressStartCallback: onPressStartCallback,
      onPressEndCallback: (e) => { setResizeData(null); onPressEndCallback && onPressEndCallback(e) },
      onCancelCallback: () => setResizeData(null),
      isCancelOnRightMouseDown
    });

  function onPressedMoveCallback(event) {
    if(!containerRect && !containerRef?.current && !isOnlyThreeDirections) {
      return;
    }

    setHasMoved(true);

    if(!containerRect) {
      containerRect = containerRef?.current.getBoundingClientRect();
    }

    let { clientX, clientY } = event;

    let containerOffsetX, containerOffsetY;
    if(!isOnlyThreeDirections) {
      containerOffsetX = event.pageX - containerRect.x;
      containerOffsetY = event.pageY - containerRect.y;
    }

    if(!isAllowToLeaveViewport) {
      clientX = Math.max(0, clientX);
      clientY = Math.max(0, clientY);
    }
    
    if(isConstrained) {
      containerOffsetX = Math.max(Math.min(0, -resizeData.resizerDiffX), containerOffsetX);
      containerOffsetY = Math.max(Math.min(0, -resizeData.resizerDiffY), containerOffsetY);
    }

    let diffX = clientX - resizeData.initialClientX;
    let diffY = clientY - resizeData.initialClientY;

    let newWidth = size.width;
    let newHeight = size.height;
    let newX = resizeData.initialPositionX;
    let newY = resizeData.initialPositionY;

    if(!resizeData.type.includes('right')) {
      newWidth = resizeData.initialWidth;
    }
    if(!resizeData.type.includes('bottom')) {
      newHeight = resizeData.initialHeight;
    }

    if(resizeData.type.includes('left')) {
      diffX *= -1;
      newX = containerOffsetX + resizeData.resizerDiffX;
      if(isConstrained) {
        newWidth = Math.min(
          resizeData.initialWidth + diffX,
          resizeData.initialPositionX + resizeData.initialWidth
        );
      } else {
        newWidth = resizeData.initialWidth + diffX;
      }
    }
    if(resizeData.type.includes('top')) {
      diffY *= -1;
      newY = containerOffsetY + resizeData.resizerDiffY;
      if(isConstrained) {
        newHeight = Math.min(
          resizeData.initialHeight + diffY,
          resizeData.initialPositionY + resizeData.initialHeight
        );
      } else {
        newHeight = resizeData.initialHeight + diffY;
      }
    }
    if(resizeData.type.includes('right')) {
      newWidth = resizeData.initialWidth + diffX;
    }
    if(resizeData.type.includes('bottom')) {
      newHeight = resizeData.initialHeight + diffY;
    }

    if(newWidth < minimalSize.width) {
      if(resizeData.type.includes('left')) {
        const diffW = minimalSize.width - newWidth;
        newX -= diffW;
      }
      newWidth = minimalSize.width;
    }
    if(newHeight < minimalSize.height) {
      if(resizeData.type.includes('top')) {
        const diffH = minimalSize.height - newHeight;
        newY -= diffH;
      }
      newHeight = minimalSize.height;
    }

    if(maximalSize) {
      newWidth = Math.min(newWidth, maximalSize.width);
      newHeight = Math.min(newHeight, maximalSize.height);
    }

    if(isConstrained) {
      if(newX + newWidth > containerRect.width) {
        newWidth = containerRect.width - newX;
      }
      if(newY + newHeight > containerRect.height) {
        newHeight = containerRect.height - newY;
      }
    }

    if(newWidth !== size.width || newHeight !== size.height) {
      setSize({ width: newWidth, height: newHeight });
    }
    if(newX !== position.x || newY !== position.y) {
      setPosition({ x: newX, y: newY });
    }
  }
  
  function onPressStartCallback(event) {
    /* 
      - when we are resizing in directions that cause movements, there may be a few-pixel jump at the beginning
      of movement, depending on where exactly resize bar was clicked, this could be fixed by adjusting initialClientX/Y
      to constant position, but it will be different for 'pointBased' and normal resize type
    */
    
    const { offsetX, offsetY } = event.nativeEvent;
    let resizerRect;
    let elementPageX, elementPageY;
    let resizerDiffX, resizerDiffY;

    if(!isOnlyThreeDirections) {
      if(!containerRect) {
        containerRect = containerRef?.current.getBoundingClientRect();
      }
      resizerRect = event.target.getBoundingClientRect();
      elementPageX = containerRect.x + (position.x * canvasZoom);
      elementPageY = containerRect.y + (position.y * canvasZoom);
      resizerDiffX = elementPageX - resizerRect.x - offsetX;
      resizerDiffY = elementPageY - resizerRect.y - offsetY;
    }

    const type = event.target.dataset.name;
    
    if(isResizable) {
      setResizeData({
        type,
        initialClientX: event.clientX,
        initialClientY: event.clientY,
        initialPositionX: Math.round(position.x * canvasZoom),
        initialPositionY: Math.round(position.y * canvasZoom),
        initialWidth: Math.round(size.width * canvasZoom),
        initialHeight: Math.round(size.height * canvasZoom),
        resizerDiffX,
        resizerDiffY
      });
      setHasMoved(false);
    }
  }

  const resizeOutlineElement = (
    isPointBased && isPressed &&
      <div 
        className="point-outline"
        style={{ 
          left: hasMoved ? position.x : resizeData.initialPositionX,
          top: hasMoved ? position.y : resizeData.initialPositionY,
          width: hasMoved ? size.width : resizeData.initialWidth,
          height: hasMoved ? size.height : resizeData.initialHeight 
        }}
      ></div>
  );

  const resizeGrabElements = (
    <>
      <div data-name="bottom" onPointerDown={onPointerDownResize} className={`${type}-bottom ${sizeClass}`}></div>
      <div data-name="right" onPointerDown={onPointerDownResize} className={`${type}-right ${sizeClass}`}></div>
      <div data-name="bottom-right" onPointerDown={onPointerDownResize} className={`${type}-bottom-right ${sizeClass}`}></div>
      {
        !isOnlyThreeDirections &&
          <>
            <div data-name="top" onPointerDown={onPointerDownResize} className={`${type}-top ${sizeClass}`}></div>
            <div data-name="left" onPointerDown={onPointerDownResize} className={`${type}-left ${sizeClass}`}></div>
            <div data-name="top-left" onPointerDown={onPointerDownResize} className={`${type}-top-left ${sizeClass}`}></div>
            <div data-name="top-right" onPointerDown={onPointerDownResize} className={`${type}-top-right ${sizeClass}`}></div>
            <div data-name="bottom-left" onPointerDown={onPointerDownResize} className={`${type}-bottom-left ${sizeClass}`}></div>
          </>
      }
    </>
  );

  return {
    resizeOutlineElement,
    resizeGrabElements,
  };
}