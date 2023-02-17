import React, { useState, useRef, useEffect } from "react";
import css from './ColorPicker.module.css';

import usePointerTrack from "../../hooks/usePointerTrack";
import { HSLtoRGB, RGBtoHSL } from "../../misc/utils";

import cursor from './assets/cursor.png';

function ColorPicker() {
  const [HSL, setHSL] = useState({ h: 0, s: 0, l: 0 });
  const [RGB, setRGB] = useState(() => HSLtoRGB(HSL));
  const fieldRef = useRef();
  const barRef = useRef();
  const onPointerDownField = usePointerTrack(onPointerField);
  const onPointerDownBar = usePointerTrack(onPointerBar);

  const cursorPosition = { 
    top: `calc(${Math.round(100 - HSL.s)}% - 10px)`,
    left: `calc(${Math.round(HSL.h / 359 * 100)}% - 10px)`
  };
  
  function onPointerField(event) {
    const rect = fieldRef.current.getBoundingClientRect();
    const offsetX = event.pageX - rect.x;
    const offsetY = event.pageY - rect.y;
    const hue = Math.max(Math.min(Math.round(offsetX * 2.05), 359), 0);
    const saturation = Math.max(Math.min(Math.round((rect.height - offsetY) / 1.87) - 1, 100), 0);

    const newHSL = { ...HSL, h: hue, s: saturation };
    setHSL(newHSL);
    setRGB(HSLtoRGB(newHSL));
  }

  function onPointerBar(event) {
    const rect = barRef.current.getBoundingClientRect();
    const offsetY = event.pageY - rect.y;
    const lightness = Math.max(Math.min(Math.round((rect.height - offsetY) / 1.87) - 1, 100), 0);

    const newHSL = { ...HSL, l: lightness };
    setHSL(newHSL);
    setRGB(HSLtoRGB(newHSL));
  }

  function onChange(event) {
    let { name, value } = event.target;

    if(value.startsWith('0' && value !== '0'))
      value = value.slice(1);
    if(value === '')
      value = '0';
    if(value.match(/[^0-9]/))
      return;

    if(name === 'h' || name === 's' || name === 'l') {
      value = Math.min(value, name === 'h' ? 359 : 100);
      const newHSL = { ...HSL, [name]: parseFloat(value) };
      setHSL(newHSL);
      setRGB(HSLtoRGB(newHSL));
    }
    else {
      value = Math.min(value, 255);
      const newRGB = { ...RGB, [name]: parseFloat(value) };
      setRGB(newRGB);
      setHSL(RGBtoHSL(newRGB));
    }
  }
  
  return (
    <div>
      <div>
        <div className={css['color-picker']}>
          <div 
            className={css['color-field']}
            onPointerDown={(e) => { onPointerField(e); onPointerDownField(e); }}
            ref={fieldRef}
          >
            <img 
              className={css['cursor']}
              draggable="false"
              src={cursor}
              alt=""
              style={cursorPosition}
            />
          </div>

          <div 
            className={css['color-bar-container']}
            onPointerDown={(e) => { onPointerBar(e); onPointerDownBar(e); }}
            ref={barRef}
          >
            <div 
              className={css['color-bar']}
              style={{ backgroundImage: `linear-gradient(
                hsl(${HSL.h}deg, ${HSL.s}%, 100%),
                hsl(${HSL.h}deg, ${HSL.s}%, 50%),
                hsl(${HSL.h}deg, ${HSL.s}%, 0%))` 
              }}
            ></div>

            <div 
              className={css['color-bar-control']}
              style={{ top: `min(calc(-4px + ${100 - HSL.l}%), 94%)` }}
            ></div>
          </div>
        </div>

        <div className={css['color-data']}>

          <div className={css['color-showcase-container']}>
            <div 
              className={css['color-showcase']}
              style={{ backgroundColor: `hsl(${HSL.h}deg, ${HSL.s}%, ${HSL.l}%)` }}
            ></div>
            <span className="text text--3">Color|Solid</span>
          </div>

          <div className={css['column']}>
            <label className={css['color-label']}>
              <span className="text text--3">Hue:</span>
              <input 
                className="form-input-text form-input-text--small"
                value={HSL.h}
                name="h"
                onChange={onChange}
              />
            </label>

            <label className={css['color-label']}>
              <span className="text text--3">Sat:</span>
              <input 
                className="form-input-text form-input-text--small"
                value={HSL.s}
                name="s"
                onChange={onChange}
              />
            </label>

            <label className={css['color-label']}>
              <span className="text text--3">Lum:</span>
              <input 
                className="form-input-text form-input-text--small"
                value={HSL.l}
                name="l"
                onChange={onChange}
              />
            </label>
          </div>
          
          <div className={css['column']}>
            <label className={css['color-label']}>
              <span className="text text--3">Red:</span>
              <input 
                className="form-input-text form-input-text--small"
                value={RGB.r}
                name="r"
                onChange={onChange}
              />
            </label>

            <label className={css['color-label']}>
              <span className="text text--3">Green:</span>
              <input 
                className="form-input-text form-input-text--small"
                value={RGB.g}
                name="g"
                onChange={onChange}
              />
            </label>

            <label className={css['color-label']}>
              <span className="text text--3">Blue:</span>
              <input 
                className="form-input-text form-input-text--small"
                value={RGB.b}
                name="b"
                onChange={onChange}
              />
            </label>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default ColorPicker;