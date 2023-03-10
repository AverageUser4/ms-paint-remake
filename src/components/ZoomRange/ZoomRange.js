import React, { useEffect, useRef, useState } from 'react';
import css from './ZoomRange.module.css';

import { useCanvasContext, zoomData } from '../../misc/CanvasContext';

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
  const { canvasZoom, setCanvasZoom, changeZoom } = useCanvasContext();
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

      if(canvasZoom !== multiplier) {
        setCanvasZoom(multiplier);
      }
    }

    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointermove', onPointerMove);

    return () => {
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, [isControlFocused, canvasZoom, setCanvasZoom]);

  return (
    <>
      <span style={{ width: 35 }} className="text">{canvasZoom * 100}%</span>

      <button className={css['minus']} onClick={() => changeZoom(true)}></button>

      <div 
        tabIndex="0" 
        className={css['range']}
        ref={rangeRef}
      >
        <div 
          style={{ left: getOffsetForMultiplier(canvasZoom) }} 
          className={css['range-control']}
          onPointerDown={(e) => e.button === 0 && setIsControlFocused(true)}
        ></div>
      </div>

      <button className={css['plus']} onClick={() => changeZoom(false)}></button>
    </>
  );
}

export default ZoomRange;