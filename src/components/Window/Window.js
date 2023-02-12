import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import css from './Window.module.css';

import useOutsideClick from '../../hooks/useOutsideClick';

function Window({ items, minWidth, minHeight }) {
  const [position, setPosition] = useState({ x: 200, y: 100 });
  const [positionDifference, setPositionDifference] = useState(null);
  const [size, setSize] = useState({ width: 600, height: 500 });
  const [resizeData, setResizeData] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const windowRef = useRef();
  useOutsideClick(windowRef, () => isFocused && setIsFocused(false));

  useEffect(() => {
    function onPointerUp() {
      setPositionDifference(null);
    }

    function onPointerMove(event) {
      if(!positionDifference)
        return;
  
      const x = event.clientX - positionDifference.x;
      const y = event.clientY - positionDifference.y;
      setPosition({ x, y });
    }

    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointermove', onPointerMove);

    return () => {
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointermove', onPointerMove);
    }
  }, [positionDifference]);

  useEffect(() => {
    function onPointerUp() {
      setResizeData(null);
    }

    function onPointerMove(event) {
      if(!resizeData)
        return;

      let diffX = event.clientX - resizeData.initialX;
      let diffY = event.clientY - resizeData.initialY;
      let newWidth = size.width;
      let newHeight = size.height;
      let newX = position.x;
      let newY = position.y;

      if(resizeData.type.includes('left')) {
        diffX *= -1;
        newX = event.clientX;
      }
      if(resizeData.type.includes('top')) {
        diffY *= -1;
        newY = event.clientY;
      }
      if(resizeData.type.includes('left') || resizeData.type.includes('right'))
        newWidth = resizeData.initialWidth + diffX;
      if(resizeData.type.includes('top') || resizeData.type.includes('bottom'))
        newHeight = resizeData.initialHeight + diffY;

      if(newWidth < minWidth) {
        if(resizeData.type.includes('left')) {
          const diffW = minWidth - newWidth;
          newX -= diffW;
        }
        newWidth = minWidth;
      }
      if(newHeight < minHeight) {
        if(resizeData.type.includes('top')) {
          const diffH = minHeight - newHeight;
          newY -= diffH;
        }
        newHeight = minHeight;
      }

      if(newWidth !== size.width || newHeight !== size.height)
        setSize({ width: newWidth, height: newHeight });
      if(newX !== position.x || newY !== position.y)
        setPosition({ x: newX, y: newY });
    }

    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointermove', onPointerMove);

    return () => {
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointermove', onPointerMove);
    }
  }, [resizeData, size, position, minHeight, minWidth]);
  
  function onPointerDownMove(event) {
    const x = event.clientX - position.x;
    const y = event.clientY - position.y;
    setPositionDifference({ x, y });
  }

  function onPointerDownResize(event) {
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
        height: size.height
      }} 
       className={`${css['container']} ${isFocused ? css['container--focused'] : ''}`}
    >
      <div data-name="top" onPointerDown={onPointerDownResize} className={css['top']}></div>
      <div data-name="bottom" onPointerDown={onPointerDownResize} className={css['bottom']}></div>
      <div data-name="left" onPointerDown={onPointerDownResize} className={css['left']}></div>
      <div data-name="right" onPointerDown={onPointerDownResize} className={css['right']}></div>
      <div data-name="top-left" onPointerDown={onPointerDownResize} className={css['top-left']}></div>
      <div data-name="top-right" onPointerDown={onPointerDownResize} className={css['top-right']}></div>
      <div data-name="bottom-left" onPointerDown={onPointerDownResize} className={css['bottom-left']}></div>
      <div data-name="bottom-right" onPointerDown={onPointerDownResize} className={css['bottom-right']}></div>
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
          itemProps.onPointerDown = onPointerDownMove;

        return <Component key={index} {...itemProps}/>
      })}
    </article>
  );
}

Window.propTypes = {
  items: PropTypes.array.isRequired,
  minWidth: PropTypes.number.isRequired,
  minHeight: PropTypes.number.isRequired,
};

export default Window;
