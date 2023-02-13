import React, { useState, useEffect } from "react";
import css from './Canvas.module.css';

function Canvas() {
  const [size, setSize] = useState({ width: 600, height: 500 });
  const [resizeData, setResizeData] = useState(null);
  const minWidth = 1;
  const minHeight = 1;

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

      if(resizeData.type.includes('right'))
        newWidth = Math.max(resizeData.initialWidth + diffX, minWidth);
      if(resizeData.type.includes('bottom'))
        newHeight = Math.max(resizeData.initialHeight + diffY, minHeight);

      if(newWidth !== size.width || newHeight !== size.height)
        setSize({ width: newWidth, height: newHeight });
    }

    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointermove', onPointerMove);

    return () => {
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointermove', onPointerMove);
    }
  }, [resizeData, size, minHeight, minWidth]);

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
    <div className={css['container']}>
      <div 
        className={css['canvas']}
        style={{ width: size.width, height: size.height }}
      ></div>

      <div onPointerDown={onPointerDownResize} data-name="bottom" className={css["bottom"]}></div>
      <div onPointerDown={onPointerDownResize} data-name="right" className={css["right"]}></div>
      <div onPointerDown={onPointerDownResize} data-name="bottom-right" className={css["bottom-right"]}></div>
    </div>
  );
}

export default Canvas;