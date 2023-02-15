import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import css from './Window.module.css';

import useOutsideClick from '../../hooks/useOutsideClick';
import useResizeCursor from '../../hooks/useResizeCursor';

function Window({ 
  items,
  containerDimensions,
  minimal = { width: 1, height: 1 },
  initialSize = { width: 600, height: 500 },
  position,
  setPosition,
  isResizable = true,
  isConstrained = true,
  isAutoShrink = true,
  isAutoFit = true,
  isInnerWindow = false,
}) {
  const [positionDifference, setPositionDifference] = useState(null);
  const [size, setSize] = useState({ width: initialSize.width, height: initialSize.height });
  const [resizeData, setResizeData] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const windowRef = useRef();
  useOutsideClick(windowRef, () => isFocused && setIsFocused(false));
  useResizeCursor(resizeData);

  useEffect(() => {
    if((!isAutoShrink && !isAutoFit) || (!isAutoFit && !isResizable) || !containerDimensions)
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
    if(isResizable && (newWidth !== size.width || newHeight !== size.height))
      setSize({ width: newWidth, height: newHeight });
  }, [containerDimensions, size, position, minimal, isAutoShrink, isAutoFit, isResizable, setPosition]);

  useEffect(() => {
    // move window
    function onPointerUp() {
      if(positionDifference)
        setPositionDifference(null);
    }

    function onPointerMove(event) {
      if(!positionDifference)
        return;
  
      let x = event.clientX - positionDifference.x;
      let y = event.clientY - positionDifference.y;

      if(isConstrained) {
        x = Math.max(Math.min(x, containerDimensions.width - size.width), 0);
        y = Math.max(Math.min(y, containerDimensions.height - size.height), 0);
      }
      
      setPosition({ x, y });
    }

    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointermove', onPointerMove);

    return () => {
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointermove', onPointerMove);
    }
  }, [positionDifference, size, isConstrained, containerDimensions, setPosition]);

  useEffect(() => {
    if(!isResizable)
      return;
    
    // resize window, moved to different effect because it could happen that
    // pointerup event was not registered when moving mouse
    function onPointerUp() {
      if(resizeData)
        setResizeData(null);
    }

    window.addEventListener('pointerup', onPointerUp);

    return () => {
      window.removeEventListener('pointerup', onPointerUp);
    }
  }, [resizeData, isResizable])
  
  useEffect(() => {
    if(!isResizable)
      return;
    
    // resize window
    function onPointerMove(event) {
      if(!resizeData)
        return;

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
      if(resizeData.type.includes('left') || resizeData.type.includes('right'))
        newWidth = resizeData.initialWidth + diffX;
      if(resizeData.type.includes('top') || resizeData.type.includes('bottom'))
        newHeight = resizeData.initialHeight + diffY;

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

      if(newWidth !== size.width || newHeight !== size.height)
        setSize({ width: newWidth, height: newHeight });
      if(newX !== position.x || newY !== position.y)
        setPosition({ x: newX, y: newY });
    }

    window.addEventListener('pointermove', onPointerMove);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
    }
  }, [resizeData, size, position, minimal, isConstrained, containerDimensions, isResizable, setPosition]);
  
  const onPointerDownMove = useCallback(
    function onPointerDownMove(event) {
      if(event.button !== 0)
        return;

      const x = event.clientX - position.x;
      const y = event.clientY - position.y;
      setPositionDifference({ x, y });
    }, [position]
  );

  function onPointerDownResize(event) {
    if(!isResizable || event.button !== 0)
      return;

    setResizeData({
      type: event.target.dataset.name,
      initialX: event.clientX,
      initialY: event.clientY,
      initialWidth: size.width,
      initialHeight: size.height
    });
  }

  function onPointerDownFocus() {
    if(!isFocused)
      setIsFocused(true);
  }
  
  return (
    <article
      onPointerDown={onPointerDownFocus}
      ref={windowRef}
      style={{ 
        top: position.y,
        left: position.x,
        width: size.width,
        height: size.height,
        zIndex: isInnerWindow ? '4' : 'auto'
      }} 
       className={`${css['container']} ${isFocused ? css['container--focused'] : ''}`}
    >
      {
        isResizable &&
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

        if(index === 0)
          itemProps.onPointerDownMove = onPointerDownMove;

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
  initialSize: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number
  }),
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
  setPosition: PropTypes.func.isRequired,
  isResizable: PropTypes.bool,
  isConstrained: PropTypes.bool,
  isAutoShrink: PropTypes.bool,
  isAutoFit: PropTypes.bool,
  isInnerWindow: PropTypes.bool,
};

export default Window;
