import React, { memo, useEffect, useRef, useState } from 'react';
import css from './ZoomRange.module.css';

import Tooltip from '../Tooltip/Tooltip';

import { useCanvasContext } from '../../context/CanvasContext';
import { useActionsContext } from '../../context/ActionsContext';
import { zoomData } from '../../misc/data';

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

const ZoomRange = memo(function ZoomRange() {
  const { canvasZoom } = useCanvasContext();
  const { doCanvasSetZoom, doCanvasChangeZoom } = useActionsContext();
  const [isControlFocused, setIsControlFocused] = useState(false);
  const rangeRef = useRef();
  
  function onPointerMove(event) {
    const difference = event.clientX - rangeRef.current.getBoundingClientRect().x;
    const multiplier = findClosestMultiplier(difference);

    if(canvasZoom !== multiplier) {
      doCanvasSetZoom(multiplier);
    }
  }

  useEffect(() => {
    function onPointerUp() {
      setIsControlFocused(false);
    }

    if(isControlFocused) {
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointermove', onPointerMove);
    }

    return () => {
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointermove', onPointerMove);
    };
  });

  return (
    <>
      <span 
        className="tooltip-container text"
        style={{ width: 35 }}
        aria-description="Zoom level"
      >
        {canvasZoom * 100}%
        <Tooltip
          type="generic"
          text="Zoom level"
        />
      </span>

      <button 
        className={`tooltip-container ${css['minus']}`}
        onClick={() => doCanvasChangeZoom(true)}
        aria-label="Zoom out"
      >
        <Tooltip
          type="generic"
          text="Zoom out"
        />
      </button>

      <div 
        className={`tooltip-container ${css['range']}`}
        tabIndex="0" 
        ref={rangeRef}
        aria-description="Zoom"
        onPointerDown={(e) => {
          if(e.button === 0) {
            setIsControlFocused(true);
            onPointerMove(e);
          }
        }}
      >
        <div 
          style={{ left: getOffsetForMultiplier(canvasZoom) }} 
          className={`
            ${css['range-control']}
            ${isControlFocused ? css['range-control--active'] : ''}
          `}
        ></div>
        <Tooltip
          type="generic"
          text="Zoom"
        />
      </div>

      <button 
        className={`tooltip-container ${css['plus']}`}
        onClick={() => doCanvasChangeZoom(false)}
        aria-label="Zoom in"
      >
        <Tooltip
          type="generic"
          text="Zoom in"
        />
      </button>
    </>
  );
});

export default ZoomRange;