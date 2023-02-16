import React, { useState, useRef } from "react";
import css from './ColorPicker.module.css';

import usePointerTrack from "../../hooks/usePointerTrack";

function ColorPicker() {
  const fieldRef = useRef();
  const barRef = useRef();
  const [color, setColor] = useState({ h: 100, s: 100, l: 10 });
  const onPointerDownField = usePointerTrack(onPointerMoveField);
  const onPointerDownBar = usePointerTrack(onPointerMoveBar);
  
  function onPointerMoveField(event) {
    if(event.target !== fieldRef.current)
      return;

    const rect = event.target.getBoundingClientRect();
    const hue = Math.max(Math.min(Math.round(event.offsetX * 2.055), 360), 0);
    const saturation = Math.min(Math.round((rect.height - event.offsetY) / 1.87) - 1, 100);

    setColor(prev => ({ ...prev, h: hue, s: saturation }));
  }

  function onPointerMoveBar(event) {
    if(event.target !== barRef.current && !barRef.current.contains(event.target))
      return;

    const rect = barRef.current.getBoundingClientRect();
    const offsetY = event.pageY - rect.y;
    const lightness = Math.max(Math.min(Math.round((rect.height - offsetY) / 1.87) - 1, 100), 0);

    setColor(prev => ({ ...prev, l: lightness }));
  }
  
  return (
    <div>
      <div>
        <div className={css['color-picker']}>
          <div 
            className={css['color-field']}
            onPointerDown={onPointerDownField}
            ref={fieldRef}
          ></div>

          <div 
            className={css['color-bar-container']}
            onPointerDown={onPointerDownBar}
            ref={barRef}
          >
            <div 
              className={css['color-bar']}
              style={{ backgroundImage: `linear-gradient(
                hsl(${color.h}deg, ${color.s}%, 100%),
                hsl(${color.h}deg, ${color.s}%, 50%),
                hsl(${color.h}deg, ${color.s}%, 0%))` 
              }}
            ></div>

            <div 
              className={css['color-bar-control']}
              style={{ top: `calc(-7px + ${100 - color.l}%)` }}
            ></div>
          </div>
        </div>

        <div className={css['color-data']}>

          <div className={css['color-showcase-container']}>
            <div 
              className={css['color-showcase']}
              style={{ backgroundColor: `hsl(${color.h}deg, ${color.s}%, ${color.l}%)` }}
            ></div>
            <span className="text text--3">Color|Solid</span>
          </div>

          <div className={css['column']}>
            <label className={css['color-label']}>
              <span className="text text--3">Hue:</span>
              <input 
                className="form-input-text form-input-text--small"
                value={color.h}
              />
            </label>

            <label className={css['color-label']}>
              <span className="text text--3">Sat:</span>
              <input 
                className="form-input-text form-input-text--small"
                value={color.s}
              />
            </label>

            <label className={css['color-label']}>
              <span className="text text--3">Lum:</span>
              <input 
                className="form-input-text form-input-text--small"
                value={color.l}
              />
            </label>
          </div>
          
          <div className={css['column']}>
            <label className={css['color-label']}>
              <span className="text text--3">Red:</span>
              <input className="form-input-text form-input-text--small"/>
            </label>

            <label className={css['color-label']}>
              <span className="text text--3">Green:</span>
              <input className="form-input-text form-input-text--small"/>
            </label>

            <label className={css['color-label']}>
              <span className="text text--3">Blue:</span>
              <input className="form-input-text form-input-text--small"/>
            </label>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default ColorPicker;