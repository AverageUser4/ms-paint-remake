import React from "react";
import css from './Rulers.module.css';

import { useCanvasContext } from '../../misc/CanvasContext';

function Rulers() {
  const { canvasZoom } = useCanvasContext();
  
  let fullStep = 125;
  
  if(canvasZoom >= 0.5) {
    fullStep = 100;
  }
  if(canvasZoom === 3) {
    fullStep = 60;
  }
  if(canvasZoom === 4) {
    fullStep = 80;
  }
  if(canvasZoom === 5) {
    fullStep = 100;
  }
  if(canvasZoom >= 6) {
    fullStep = canvasZoom * 10;
  }

  let subStep = fullStep / 10;

  const textArray = [];
  // should be ruler width instead of window inner width
  for(let x = 0; x < window.innerWidth; x += fullStep) {
    textArray.push(
      <text x={x} y="10">100</text>
    );
  }

  
  return (
    <>
      <svg 
        className={`${css['ruler']} ${css['ruler--top']}`}
        xmlns="http://www.w3.org/2000/svg"
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