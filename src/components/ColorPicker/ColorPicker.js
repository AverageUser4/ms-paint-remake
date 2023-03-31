import React, { memo, useRef } from "react";
import css from './ColorPicker.module.css';

import usePointerTrack from "../../hooks/usePointerTrack";
import { useColorContext } from "../../context/ColorContext";
import { checkNumberValue, HSLtoRGB, RGBtoHSL } from "../../misc/utils";

import cursor from './assets/cursor.png';

const ColorPicker = memo(function ColorPicker() {
  const { colorPickerData, setColorPickerData } = useColorContext();
  const { HSL, RGB } = colorPickerData;
  
  const fieldRef = useRef();
  const barRef = useRef();
  const { onPointerDown: onPointerDownField } = usePointerTrack({ onPressedMoveCallback: onPointerField });
  const { onPointerDown: onPointerDownBar } = usePointerTrack({ onPressedMoveCallback: onPointerBar });

  const cursorPosition = {
    x: `calc(${Math.round(HSL.h / 359 * 100)}% - 10px)`,
    y: `calc(${Math.round(100 - HSL.s)}% - 10px)`,
  };
  
  function onPointerField(event) {
    const rect = fieldRef.current.getBoundingClientRect();
    const offsetX = event.pageX - rect.x;
    const offsetY = event.pageY - rect.y;
    const hue = Math.max(Math.min(Math.round(offsetX * 2.05), 359), 0);
    const saturation = Math.max(Math.min(Math.round((rect.height - offsetY) / 1.87) - 1, 100), 0);

    const newHSL = { ...HSL, h: hue, s: saturation };
    setColorPickerData(prev => ({ ...prev, HSL: newHSL, RGB: HSLtoRGB(newHSL)}));
  }

  function onPointerBar(event) {
    const rect = barRef.current.getBoundingClientRect();
    const offsetY = event.pageY - rect.y;
    const lightness = Math.max(Math.min(Math.round((rect.height - offsetY) / 1.87) - 1, 100), 0);

    const newHSL = { ...HSL, l: lightness };
    setColorPickerData(prev => ({ ...prev, HSL: newHSL, RGB: HSLtoRGB(newHSL)}));
  }

  function onChange(event) {
    const { name, value } = event.target;

    let { numValue: numUsedValue, isInvalid } = checkNumberValue(value);
    if(isInvalid) {
      return;
    }

    if(name === 'h' || name === 's' || name === 'l') {
      numUsedValue = Math.min(numUsedValue, name === 'h' ? 359 : 100);
      const newHSL = { ...HSL, [name]: numUsedValue };
      setColorPickerData(prev => ({ ...prev, HSL: newHSL, RGB: HSLtoRGB(newHSL)}));
    }
    else {
      numUsedValue = Math.min(numUsedValue, 255);
      const newRGB = { ...RGB, [name]: numUsedValue };
      setColorPickerData(prev => ({ ...prev, RGB: newRGB, HSL: RGBtoHSL(newRGB)}));
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
            data-cy="ColorPicker-field"
          >
            <img 
              className={css['cursor']}
              draggable="false"
              src={cursor}
              alt=""
              style={{
                top: cursorPosition.y,
                left: cursorPosition.x,
              }}
            />
          </div>

          <div 
            className={css['color-bar-container']}
            onPointerDown={(e) => { onPointerBar(e); onPointerDownBar(e); }}
            ref={barRef}
            data-cy="ColorPicker-bar"
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
                data-cy="ColorPicker-input-h"
              />
            </label>

            <label className={css['color-label']}>
              <span className="text text--3">Sat:</span>
              <input 
                className="form-input-text form-input-text--small"
                value={HSL.s}
                name="s"
                onChange={onChange}
                data-cy="ColorPicker-input-s"
              />
            </label>

            <label className={css['color-label']}>
              <span className="text text--3">Lum:</span>
              <input 
                className="form-input-text form-input-text--small"
                value={HSL.l}
                name="l"
                onChange={onChange}
                data-cy="ColorPicker-input-l"
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
                data-cy="ColorPicker-input-r"
              />
            </label>

            <label className={css['color-label']}>
              <span className="text text--3">Green:</span>
              <input 
                className="form-input-text form-input-text--small"
                value={RGB.g}
                name="g"
                onChange={onChange}
                data-cy="ColorPicker-input-g"
              />
            </label>

            <label className={css['color-label']}>
              <span className="text text--3">Blue:</span>
              <input 
                className="form-input-text form-input-text--small"
                value={RGB.b}
                name="b"
                onChange={onChange}
                data-cy="ColorPicker-input-b"
              />
            </label>
          </div>
          
        </div>
      </div>
    </div>
  );
});

export default ColorPicker;