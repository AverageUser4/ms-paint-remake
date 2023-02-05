import React, { useEffect, useState } from 'react';
import css from './Window.module.css';

function Window({ items }) {
  const [position, setPosition] = useState({ x: 200, y: 100 });
  const [positionDifference, setPositionDifference] = useState(null);
  const [size, setSize] = useState({ width: 600, height: 500 });
  const [resizeData, setResizeData] = useState(null);

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
        diffX = resizeData.initialX - event.clientX;
        newX = resizeData.initialX - diffX;
      }
      if(resizeData.type.includes('top')) {
        diffY = resizeData.initialY - event.clientY;
        newY = resizeData.initialY - diffY;
      }
      if(resizeData.type.includes('left') || resizeData.type.includes('right'))
        newWidth = resizeData.initialWidth + diffX;
      if(resizeData.type.includes('top') || resizeData.type.includes('bottom'))
        newHeight = resizeData.initialHeight + diffY;
      
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
  }, [resizeData, size, position]);
  
  function onPointerDown(event) {
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
  
  return (
    <article 
      style={{ 
        top: position.y,
        left: position.x,
        width: size.width,
        height: size.height
      }} 
       className={css['container']}
    >
      <div data-name="top" onPointerDown={onPointerDownResize} className={css['top']}></div>
      <div data-name="bottom" onPointerDown={onPointerDownResize} className={css['bottom']}></div>
      <div data-name="left" onPointerDown={onPointerDownResize} className={css['left']}></div>
      <div data-name="right" onPointerDown={onPointerDownResize} className={css['right']}></div>
      <div data-name="top-left" onPointerDown={onPointerDownResize} className={css['top-left']}></div>
      <div data-name="top-right" onPointerDown={onPointerDownResize} className={css['top-right']}></div>
      <div data-name="bottom-left" onPointerDown={onPointerDownResize} className={css['bottom-left']}></div>
      <div data-name="bottom-right" onPointerDown={onPointerDownResize} className={css['bottom-right']}></div>
      {/* <Top onPointerDown={onPointerDown}/> */}
      {items.map((Item, index) => {
        const itemProps = { windowWidth: size.width, key: index };
        if(index === 0)
          itemProps.onPointerDown = onPointerDown;

        return <Item {...itemProps}/>
      })}
    </article>
  );
}

export default Window;