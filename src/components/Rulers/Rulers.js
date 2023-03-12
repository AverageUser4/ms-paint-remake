import React from "react";
import css from './Rulers.module.css';

import { useCanvasContext } from '../../misc/CanvasContext';

function Rulers() {
  const { canvasZoom, canvasSize } = useCanvasContext();
  
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

  const rulerWidth = canvasSize.width;
  
  const textArray = [];
  let i = 0;
  // should be ruler width instead of window inner width
  for(let x = 0; x < rulerWidth; x += fullStep) {
    textArray.push(
      <text
        className="text"
        key={x}
        x={x + 5}
        y="11"
        style={{ fontSize: 12 }}
        fill="rgb(51, 75, 106)"
      >
        {stepValue * i}
      </text>
    );

    i++;
  }

  
  return (
    <>
      <svg 
        className={`${css['ruler']} ${css['ruler--top']}`}
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: `calc(${rulerWidth}px - var(--canvas-container-padding) - var(--rulers-size))`
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

        {textArray}
        
      </svg>

      <svg 
        className={`${css['ruler']} ${css['ruler--left']}`}
        xmlns="http://www.w3.org/2000/svg"
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
      </svg>
    </>
  );
}

export default Rulers;