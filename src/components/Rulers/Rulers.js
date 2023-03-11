import React from "react";
import css from './Rulers.module.css';

function Rulers() {
  return (
    <>
      <svg 
        className={`${css['ruler']} ${css['ruler--top']}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="smallGrid" width={100} height={17} patternUnits="userSpaceOnUse">
            <path 
              d={`M 0,0 L 0,17`}
              fill="none"
              stroke="rgb(142, 156, 175)"
              strokeWidth="2"
            />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#smallGrid)" />
      </svg>

      <div className={`${css['ruler']} ${css['ruler--left']}`}></div>
    </>
  );
}

export default Rulers;