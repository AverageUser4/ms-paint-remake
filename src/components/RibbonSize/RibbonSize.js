import React, { useState, useRef } from "react";
import css from './RibbonSize.module.css';

import BigButton from "../BigButton/BigButton";
import useOutsideClick from '../../hooks/useOutsideClick';
import { toggleBoolState } from "../../misc/utils";

import size32 from './assets/size-32.png';

function RibbonSize() {
  const dropdownRef = useRef();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  useOutsideClick(dropdownRef, () => isDropdownOpen && setIsDropdownOpen(false));
  // will come from props
  const sizes = [8, 16, 30, 40];
  const currentSize = 16;

  return (
    <BigButton 
      icon={size32}
      name="Size"
      showChildren={isDropdownOpen}
      onPointerDown={(e) => e.button === 0 && toggleBoolState(isDropdownOpen, setIsDropdownOpen)}
    >
      <div className={css['container']} ref={dropdownRef}>
        {
          sizes.map(size => 
            <button 
              key={size}
              className={`${css['button']} ${size === currentSize ? css['button--active'] : ''}`}
            >
              <div className={css['size']} style={{ height: size < 20 ? size : Math.round(size / 1.4) }}></div>
            </button>)
        }
      </div>
    </BigButton>
  );
}

export default RibbonSize;