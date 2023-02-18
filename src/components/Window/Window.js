import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import css from './Window.module.css';

import useOutsideClick from '../../hooks/useOutsideClick';
import useResizeCursor from '../../hooks/useResizeCursor';
import usePointerTrack from '../../hooks/usePointerTrack';
import { useMainWindowContext } from '../../misc/MainWindowContext';
import { useContainerContext } from '../../misc/ContainerContext';

function Window({ 
  items,
  minimal = { width: 1, height: 1 },
  size,
  setSize,
  position,
  setPosition,
  isFocused,
  setIsFocused,
  isResizable = true,
  isConstrained = true,
  isAutoShrink = true,
  isAutoFit = true,
  isInnerWindow = false,
  isOpen = true,
  isIgnorePointerEvents = false,
  isMaximized = false,
}) {
  const { containerDimensions, containerRef } = useContainerContext();
  const { mainWindowRestoreSize, mainWindowLatestSize } = useMainWindowContext();
  const [isActuallyOpen, setIsActuallyOpen] = useState(isOpen);
  const [positionDifference, setPositionDifference] = useState(null);
  const [resizeData, setResizeData] = useState(null);
  const [isAttentionAnimated, setIsAttentionAnimated] = useState(false);
  const windowRef = useRef();
  useResizeCursor(resizeData);

  if(!isInnerWindow)
    console.log(isConstrained)

  const isAllowResize = isResizable && !isMaximized;

  useOutsideClick(windowRef, () => { 
    if(!isInnerWindow && isFocused) {
      setIsFocused(false);
    }
    else if(isInnerWindow && !isAttentionAnimated && isOpen && isActuallyOpen) {
      setIsAttentionAnimated(true);
      setTimeout(() => setIsAttentionAnimated(false), 1000);
    }
  });

  useEffect(() => {
    if(isMaximized && containerDimensions) {
      setSize(containerDimensions);
      setPosition({ x: 0, y: 0 });
    }
  }, [isMaximized, containerDimensions, setSize, setPosition]);
  
  useEffect(() => {
    if(isOpen && !isActuallyOpen) {
      setIsActuallyOpen(true);
    }
    if(!isOpen && isActuallyOpen) {
      setTimeout(() => setIsActuallyOpen(false), 150);
    }
  }, [isOpen, isActuallyOpen]);

  const onPointerDownMove = usePointerTrack(onPointerMoveMoveCallback, onPointerDownMoveCallback);

  function onPointerDownMoveCallback(event) {
    const containerRect = containerRef.current.getBoundingClientRect();
    const containerX = event.pageX - containerRect.x;
    const containerY = event.pageY - containerRect.y;

    console.log(containerX, event.clientX - position.x)
    
    const x = event.clientX - position.x;
    const y = event.clientY - position.y;
    
    setPositionDifference({ x, y });
  }
  
  function onPointerMoveMoveCallback(event) {
    let x = event.clientX - positionDifference.x;
    let y = event.clientY - positionDifference.y;
    
    if(isConstrained) {
      x = Math.max(Math.min(x, containerDimensions.width - size.width), 0);
      y = Math.max(Math.min(y, containerDimensions.height - size.height), 0);
    }

    if(!isInnerWindow && isMaximized && containerRef.current) {
      console.log('??!!')
      
      const containerRect = containerRef.current.getBoundingClientRect();
      const pointerContainerX = event.pageX - containerRect.x;
      const pointerRatioX = pointerContainerX / containerRect.width;

      const widthBeforeCursor = Math.round(mainWindowLatestSize.width * pointerRatioX);
      // const pointerContainerY = event.pageY - containerRect.y;

      const adjustedX = pointerContainerX - widthBeforeCursor;
      const adjustedY = 0;

      console.log(mainWindowLatestSize, pointerRatioX, widthBeforeCursor)

      
      mainWindowRestoreSize();
      setPosition({ x: adjustedX, y: adjustedY })
    } else {
      setPosition({ x, y });
    }
  }

  const onPointerDownResize = usePointerTrack(onPointerMoveResizeCallback, onPointerDownResizeCallback, () => setResizeData(null));

  function onPointerMoveResizeCallback(event) {
    let { clientX, clientY } = event;
    if(isConstrained) {
      clientX = Math.max(0, clientX);
      clientY = Math.max(0, clientY);
    }
      
    let diffX = clientX - resizeData.initialX;
    let diffY = clientY - resizeData.initialY;

    let newWidth = size.width;
    let newHeight = size.height;
    let newX = position.x;
    let newY = position.y;

    if(resizeData.type.includes('left')) {
      diffX *= -1;
      newX = clientX;
    }
    if(resizeData.type.includes('top')) {
      diffY *= -1;
      newY = clientY;
    }
    if(resizeData.type.includes('left') || resizeData.type.includes('right')) {
      newWidth = resizeData.initialWidth + diffX;
    }
    if(resizeData.type.includes('top') || resizeData.type.includes('bottom')) {
      newHeight = resizeData.initialHeight + diffY;
    }

    if(newWidth < minimal.width) {
      if(resizeData.type.includes('left')) {
        const diffW = minimal.width - newWidth;
        newX -= diffW;
      }
      newWidth = minimal.width;
    }
    if(newHeight < minimal.height) {
      if(resizeData.type.includes('top')) {
        const diffH = minimal.height - newHeight;
        newY -= diffH;
      }
      newHeight = minimal.height;
    }

    if(isConstrained) {
      if(newX + newWidth > containerDimensions.width) {
        newWidth = containerDimensions.width - newX;
      }
      if(newY + newHeight > containerDimensions.height) {
        newHeight = containerDimensions.height - newY;
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
    setResizeData({
      type: event.target.dataset.name,
      initialX: event.clientX,
      initialY: event.clientY,
      initialWidth: size.width,
      initialHeight: size.height
    });
  }

  useEffect(() => {
    if((!isAutoShrink && !isAutoFit) || (!isAutoFit && !isAllowResize) || !containerDimensions || !isConstrained)
      return;
    
    let newX = position.x;
    let newY = position.y;
    let newWidth = size.width;
    let newHeight = size.height;

    if(position.x + size.width > containerDimensions.width) {
      if(isAutoFit)
        newX = Math.max(containerDimensions.width - size.width, 0);
      if(newX === 0 || !isAutoFit)
        newWidth = Math.max(containerDimensions.width - position.x, minimal.width);
    }
    if(position.y + size.height > containerDimensions.height) {
      if(isAutoFit)
        newY = Math.max(containerDimensions.height - size.height, 0);
      if(newY === 0 || !isAutoFit)
        newHeight = Math.max(containerDimensions.height - position.y, minimal.height);
    }

    if(newX !== position.x || newY !== position.y)
      setPosition({ x: newX, y: newY });
    if(isAllowResize && (newWidth !== size.width || newHeight !== size.height))
      setSize({ width: newWidth, height: newHeight });
  }, [containerDimensions, size, setSize, position, minimal, isAutoShrink, isAutoFit, isAllowResize, setPosition, isConstrained]);

  function onPointerDownFocus() {
    if(!isInnerWindow && !isFocused)
      setIsFocused(true);
  }
  
  if(!isOpen && !isActuallyOpen)
    return null;
  
  return (
    <article
      onPointerDown={onPointerDownFocus}
      ref={windowRef}
      style={{ 
        top: position.y,
        left: position.x,
        width: size.width,
        height: size.height,
        zIndex: isInnerWindow ? '4' : 'auto',
      }} 
       className={`
        ${css['container']}
        ${isFocused ? css['container--focused'] : ''}
        ${isInnerWindow ? css['container--inner'] : ''}
        ${((isOpen && !isActuallyOpen) || (!isOpen && isActuallyOpen)) ? css['container--hidden'] : ''}
        ${isAttentionAnimated ? css['container--attention'] : ''}
        ${isIgnorePointerEvents ? css['container--locked'] : ''}
      `}
    >
      {
        isAllowResize &&
          <>
            <div data-name="top" onPointerDown={onPointerDownResize} className={css['top']}></div>
            <div data-name="bottom" onPointerDown={onPointerDownResize} className={css['bottom']}></div>
            <div data-name="left" onPointerDown={onPointerDownResize} className={css['left']}></div>
            <div data-name="right" onPointerDown={onPointerDownResize} className={css['right']}></div>
            <div data-name="top-left" onPointerDown={onPointerDownResize} className={css['top-left']}></div>
            <div data-name="top-right" onPointerDown={onPointerDownResize} className={css['top-right']}></div>
            <div data-name="bottom-left" onPointerDown={onPointerDownResize} className={css['bottom-left']}></div>
            <div data-name="bottom-right" onPointerDown={onPointerDownResize} className={css['bottom-right']}></div>
          </>
      }
      
      {items.map((item, index) => {
        if(!item)
          return null;
        
        const { Component, props } = item;

        const itemProps = { 
          ...props, 
          windowWidth: size.width, 
          windowHasFocus: isFocused
        };

        if(index === 0) {
          itemProps.onPointerDownMove = onPointerDownMove;
          itemProps.isAttentionAnimated = isAttentionAnimated;
        }

        return <Component key={index} {...itemProps}/>
      })}
    </article>
  );
}

Window.propTypes = {
  items: PropTypes.array.isRequired,
  minimal: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number
  }),
  containerDimensions: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number
  }),
  size: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }).isRequired,
  setSize: PropTypes.func.isRequired,
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
  isFocused: PropTypes.bool,
  setIsFocused: PropTypes.func,
  setPosition: PropTypes.func.isRequired,
  isResizable: PropTypes.bool,
  isConstrained: PropTypes.bool,
  isAutoShrink: PropTypes.bool,
  isAutoFit: PropTypes.bool,
  isInnerWindow: PropTypes.bool,
  isOpen: PropTypes.bool,
  isIgnorePointerEvents: PropTypes.bool,
  isMaximized: PropTypes.bool,
};

export default Window;
