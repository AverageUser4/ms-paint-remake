import React, { useEffect, useRef, useState } from 'react';
import css from './ZoomRange.module.css';

import { usePaintContext, zoomData } from '../../misc/PaintContext';

function getOffsetForMultiplier(multiplier) {
  return zoomData.find(data => data.multiplier === multiplier).offset;
}

function findClosestMultiplier(offset) {
  let closest = { multiplier: zoomData[0].multiplier, difference: Math.abs(offset - zoomData[0].offset )};

  for(let i = 1; i < zoomData.length; i++) {
    const difference = Math.abs(offset - zoomData[i].offset);
    if(difference < closest.difference)
      closest = { multiplier: zoomData[i].multiplier, difference };
  }

  return closest.multiplier;
}

function ZoomRange() {
  const { canvasData, setCanvasData } = usePaintContext();
  const [isControlFocused, setIsControlFocused] = useState(false);
  const rangeRef = useRef();
  
  useEffect(() => {
    function onPointerUp() {
      if(isControlFocused)
        setIsControlFocused(false);
    }

    function onPointerMove(event) {
      if(!isControlFocused)
        return;

      const difference = event.clientX - rangeRef.current.getBoundingClientRect().x;
      const multiplier = findClosestMultiplier(difference);

      if(canvasData.zoom !== multiplier)
        setCanvasData(prev => ({ ...prev, zoom: multiplier }));
    }

    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointermove', onPointerMove);

    return () => {
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, [isControlFocused, canvasData, setCanvasData]);
  
  function changeZoom(decrease) {
    const currentIndex = zoomData.findIndex(data => data.multiplier === canvasData.zoom); 
    const newIndex = currentIndex + (decrease ? -1 : 1);

    if(newIndex < 0 || newIndex >= zoomData.length)
      return;

    setCanvasData(prev => ({ ...prev, zoom: zoomData[newIndex].multiplier }));
  }

  return (
    <>
      <span style={{ width: 35 }} className="text">{canvasData.zoom * 100}%</span>

      <button className={css['minus']} onClick={() => changeZoom(true)}></button>

      <div 
        tabIndex="0" 
        className={css['range']}
        ref={rangeRef}
      >
        <div 
          style={{ left: getOffsetForMultiplier(canvasData.zoom) }} 
          className={css['range-control']}
          onPointerDown={(e) => e.button === 0 && setIsControlFocused(true)}
        ></div>
      </div>

      <button className={css['plus']} onClick={() => changeZoom(false)}></button>
    </>
  );
}

export default ZoomRange;