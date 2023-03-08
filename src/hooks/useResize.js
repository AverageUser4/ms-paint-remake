import React, { useState } from "react";

import useResizeCursor from './useResizeCursor';
import usePointerTrack from './usePointerTrack';
import { checkArgs } from "../misc/utils";

export default function useResize({
  containerRect,
  containerRef,
  minimalSize,
  position, 
  setPosition, 
  size, 
  setSize,
  zoom = 1,
  isConstrained,
  isResizable,
  isAllowToLeaveViewport,
  isOnlyThreeDirections,
  isPointBased,
  isCancelOnRightMouseDown,
  onPointerUpCallback,
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

  const { onPointerDown: onPointerDownResize, isPressed } = 
    usePointerTrack({ 
      onPointerMoveCallback: onPointerMoveCallback,
      onPointerDownCallback: onPointerDownCallback,
      onPointerUpCallback: (e) => { setResizeData(null); onPointerUpCallback && onPointerUpCallback(e) },
      onCancelCallback: () => setResizeData(null),
      isCancelOnRightMouseDown
    });

  function onPointerMoveCallback(event) {
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

    let diffX = clientX - resizeData.initialX;
    let diffY = clientY - resizeData.initialY;

    let newWidth = size.width;
    let newHeight = size.height;
    let newX = position.x;
    let newY = position.y;

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
  
  function onPointerDownCallback(event) {
    /* 
      - when we are resizing in directions that cause movements, there may be a few-pixel jump at the beginning
      of movement, depending on where exactly resize bar was clicked, this could be fixed by adjusting initialX/Y
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
      elementPageX = containerRect.x + position.x;
      elementPageY = containerRect.y + position.y;
      resizerDiffX = elementPageX - resizerRect.x - offsetX;
      resizerDiffY = elementPageY - resizerRect.y - offsetY;
    }

    if(isResizable) {
      setResizeData({
        type: event.target.dataset.name,
        initialX: event.clientX,
        initialY: event.clientY,
        initialPositionX: position.x,
        initialPositionY: position.y,
        initialWidth: Math.round(size.width * zoom),
        initialHeight: Math.round(size.height * zoom),
        resizerDiffX,
        resizerDiffY
      });
      setHasMoved(false);
    }
  }

  const resizeElements = (
    <>
      {
        isPointBased && isPressed &&
          <div 
            className="point-outline"
            style={{ 
              width: hasMoved ? size.width : resizeData.initialWidth,
              height: hasMoved ? size.height : resizeData.initialHeight 
            }}
          ></div>
      }

      <div data-name="bottom" onPointerDown={onPointerDownResize} className={isPointBased ? 'point-bottom' : 'resize-bottom'}></div>
      <div data-name="right" onPointerDown={onPointerDownResize} className={isPointBased ? 'point-right' : 'resize-right'}></div>
      <div data-name="bottom-right" onPointerDown={onPointerDownResize} className={isPointBased ? 'point-bottom-right' : 'resize-bottom-right'}></div>
      {
        !isOnlyThreeDirections &&
          <>
            <div data-name="top" onPointerDown={onPointerDownResize} className={isPointBased ? 'point-top' : 'resize-top'}></div>
            <div data-name="left" onPointerDown={onPointerDownResize} className={isPointBased ? 'point-left' : 'resize-left'}></div>
            <div data-name="top-left" onPointerDown={onPointerDownResize} className={isPointBased ? 'point-top-left' : 'resize-top-left'}></div>
            <div data-name="top-right" onPointerDown={onPointerDownResize} className={isPointBased ? 'point-top-right' : 'resize-top-right'}></div>
            <div data-name="bottom-left" onPointerDown={onPointerDownResize} className={isPointBased ? 'point-bottom-left' : 'resize-bottom-left'}></div>
          </>
      }
    </>
  );

  return {
    resizeElements
  };
}