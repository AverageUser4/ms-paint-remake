import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import css from './Rulers.module.css';

import { useCanvasContext } from '../../misc/CanvasContext';

function Rulers({ containerRef }) {
  const [forceRender, setForceRender] = useState(true);
  const { canvasZoom, canvasSize, canvasMousePosition } = useCanvasContext();
  
  let fullStep = 125;
  if(canvasZoom >= 0.5) { fullStep = 100; }
  if(canvasZoom === 3) { fullStep = 60; }
  if(canvasZoom === 4) { fullStep = 80; }
  if(canvasZoom === 5) { fullStep = 100; }
  if(canvasZoom >= 6) { fullStep = canvasZoom * 10; }
  let subStep = fullStep / 10;

  let stepValue = 1000;
  if(canvasZoom === 0.25) { stepValue = 500; }
  if(canvasZoom === 0.5) { stepValue = 200; }
  if(canvasZoom === 1) { stepValue = 100; }
  if(canvasZoom === 2) { stepValue = 50; }
  if(canvasZoom >= 3) { stepValue = 20; }
  if(canvasZoom >= 6) { stepValue = 10; }

  const containerWidth = containerRef.current?.clientWidth || 0;
  const containerHeight = containerRef.current?.clientHeight || 0;
  const rulerWidth = Math.max(canvasSize.width, containerWidth);
  const rulerHeight = Math.max(canvasSize.height, containerHeight);
  const topTextArray = [];
  const leftTextArray = [];
  
  // 30 is size of resizer (the dots you press when resizing canvas)
  for(let x = 0; x < rulerWidth + 30; x += fullStep) {
    topTextArray.push(
      <text
        key={x}
        x={x + 5} y="11"
        style={{ fontSize: 12 }}
        fill="rgb(51, 75, 106)"
      >
        {stepValue * x / fullStep}
      </text>
    );
  }
  for(let y = 0; y < rulerHeight + 30; y += fullStep) {
    leftTextArray.push(
      <text
        key={y}
        x={0} y={y + 20}
        style={{ fontSize: 12 }}
        fill="rgb(51, 75, 106)"
        transform={`translate(${25 + y} ${5 + y}) rotate(90)`}
      >
        {stepValue * y / fullStep}
      </text>
    );
  }

  useEffect(() => {
    // in some cases containerWidth/Height would be incorrect because containerRef.current
    // hasn't yet updated, this effect fixes that, alternatively may move all calculations
    // to this effect instead, but variables would have to be put into state
    if(!containerRef.current) {
      return;
    }

    if(
        containerWidth !== containerRef.current.clientWidth || 
        containerHeight !== containerRef.current.clientHeight
      ) {
      setForceRender(prev => !prev);
    }
  })

  return (
    <>
      <svg
        className={`${css['ruler']} ${css['ruler--top-left']}`}
      >
        <path
          d="M 0,0 L 22,0 22,17 Q 16,17 17,22 L 0,22 Z"
          fill="rgb(241, 243, 248)"
        />
        <path
          d="M 22.5,17.5 Q 16.5,17.5 17.5,22.5"
          fill="none"
          stroke="rgb(142, 156, 175)"
        />
      </svg>
    
      <svg 
        className={`${css['ruler']} ${css['ruler--top']}`}
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: rulerWidth === containerWidth ?
            `calc(${rulerWidth}px - var(--canvas-container-padding) - var(--rulers-size))`
          : 
            `calc(${rulerWidth}px + var(--resizer-size))`
        }}
      >
        <defs>
          <pattern id="helperPatternTop" width={subStep} height={17} patternUnits="userSpaceOnUse">
            <line
              x1={0} y1={13}
              x2={0} y2={17}
              stroke="rgb(142, 156, 175)"
              strokeWidth="2"
            />
          </pattern>
          <pattern id="mainPatternTop" width={fullStep} height={17} patternUnits="userSpaceOnUse">
            <line
              x1={0} y1={0}
              x2={0} y2={17}
              stroke="rgb(142, 156, 175)"
              strokeWidth="2"
            />
            <rect width="100%" height="100%" fill="url(#helperPatternTop)" />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#mainPatternTop)" />

        {topTextArray}

        {
          canvasMousePosition &&
            <line
              x1={canvasMousePosition.x + 0.5} y1={0}
              x2={canvasMousePosition.x + 0.5} y2={17}
              stroke="red"
              strokeWidth="1"
            />
        }
      </svg>

      <svg 
        className={`${css['ruler']} ${css['ruler--left']}`}
        xmlns="http://www.w3.org/2000/svg"
        style={{
          height: rulerHeight === containerHeight ?
            `calc(${rulerHeight}px - var(--canvas-container-padding) - var(--rulers-size))`
          : 
            `calc(${rulerHeight}px + var(--resizer-size))`
        }}
      >
        <defs>
          <pattern id="helperPatternLeft" width={17} height={10} patternUnits="userSpaceOnUse">
            <line
              x1={13} y1={0}
              x2={17} y2={0}
              stroke="rgb(142, 156, 175)"
              strokeWidth="2"
            />
          </pattern>
          <pattern id="mainPatternLeft" width={17} height={100} patternUnits="userSpaceOnUse">
            <line
              x1={0} y1={0}
              x2={17} y2={0}
              stroke="rgb(142, 156, 175)"
              strokeWidth="2"
            />
            <rect width="100%" height="100%" fill="url(#helperPatternLeft)" />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#mainPatternLeft)" />

        {leftTextArray}

        {
          canvasMousePosition &&
            <line
              x1="0" y1={canvasMousePosition.y + 0.5}
              x2="17" y2={canvasMousePosition.y + 0.5}
              stroke="red"
              strokeWidth="1"
            />
        }
      </svg>
    </>
  );
}

Rulers.propTypes = {
  containerRef: PropTypes.object.isRequired,
};

export default Rulers;