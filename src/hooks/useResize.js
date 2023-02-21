import React, { useState } from "react";

import useResizeCursor from './useResizeCursor';
import usePointerTrack from './usePointerTrack';
import { useContainerContext } from '../misc/ContainerContext';
import { checkArgs } from "../misc/utils";

export default function useResize({
  minimalSize,
  position, 
  setPosition, 
  size, 
  setSize,
  isConstrained,
  isResizable,
  isAllowToLeaveViewport, 
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

  const { containerRect } = useContainerContext();
  const [resizeData, setResizeData] = useState(null);
  useResizeCursor(resizeData);

  const { onPointerDown: onPointerDownResize } = 
    usePointerTrack(onPointerMoveResizeCallback, onPointerDownResizeCallback, () => setResizeData(null));

  function onPointerMoveResizeCallback(event) {
    if(!containerRect) {
      return;
    }

    let { clientX, clientY } = event;

    let containerOffsetX = event.clientX - containerRect.x;
    let containerOffsetY = event.clientY - containerRect.y;

    if(!isAllowToLeaveViewport) {
      clientX = Math.max(0, clientX);
      clientY = Math.max(0, clientY);
    }
    
    if(isConstrained) {
      containerOffsetX = Math.max(0, containerOffsetX);
      containerOffsetY = Math.max(0, containerOffsetY);
    }
      
    let diffX = clientX - resizeData.initialX;
    let diffY = clientY - resizeData.initialY;

    let newWidth = size.width;
    let newHeight = size.height;
    let newX = position.x;
    let newY = position.y;

    if(resizeData.type.includes('left')) {
      diffX *= -1;
      newX = isConstrained ? containerOffsetX : clientX;
    }
    if(resizeData.type.includes('top')) {
      diffY *= -1;
      newY = isConstrained ? containerOffsetY : clientY;
    }
    if(resizeData.type.includes('left') || resizeData.type.includes('right')) {
      newWidth = resizeData.initialWidth + diffX;
    }
    if(resizeData.type.includes('top') || resizeData.type.includes('bottom')) {
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
  
  function onPointerDownResizeCallback(event) {
    if(isResizable) {
      setResizeData({
        type: event.target.dataset.name,
        initialX: event.clientX,
        initialY: event.clientY,
        initialWidth: size.width,
        initialHeight: size.height
      });
    }
  }

  const resizeElements = 
    <>
      <div data-name="top" onPointerDown={onPointerDownResize} className="resize-top"></div>
      <div data-name="bottom" onPointerDown={onPointerDownResize} className="resize-bottom"></div>
      <div data-name="left" onPointerDown={onPointerDownResize} className="resize-left"></div>
      <div data-name="right" onPointerDown={onPointerDownResize} className="resize-right"></div>
      <div data-name="top-left" onPointerDown={onPointerDownResize} className="resize-top-left"></div>
      <div data-name="top-right" onPointerDown={onPointerDownResize} className="resize-top-right"></div>
      <div data-name="bottom-left" onPointerDown={onPointerDownResize} className="resize-bottom-left"></div>
      <div data-name="bottom-right" onPointerDown={onPointerDownResize} className="resize-bottom-right"></div>
    </>;

  return {
    resizeElements
  };
}