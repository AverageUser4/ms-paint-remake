import React, { useRef, useState } from "react";
import css from './RibbonBrushes.module.css';

import BigButtonDuo from "../BigButtonDuo/BigButtonDuo";
import useOutsideClick from "../../hooks/useOutsideClick";
import { toggleBoolState } from "../../misc/utils";

import air32 from './assets/air-32.png';
import brush32 from './assets/brush-32.png';
import calligraphy132 from './assets/calligraphy-1-32.png';
import calligraphy232 from './assets/calligraphy-2-32.png';
import crayon32 from './assets/crayon-32.png';
import marker32 from './assets/marker-32.png';
import oil32 from './assets/oil-32.png';
import pencil32 from './assets/pencil-32.png';
import water32 from './assets/water-32.png';

function RibbonBrushes() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  useOutsideClick(dropdownRef, () => isDropdownOpen && setIsDropdownOpen(false));

  return (
    <BigButtonDuo 
      icon={brush32} 
      name="Brushes"
      showChildren={isDropdownOpen}
      setShowChildren={setIsDropdownOpen}
      onPointerDownBottom={(e) => e.button === 0 && toggleBoolState(isDropdownOpen, setIsDropdownOpen)}
    >
      <div 
        className="popup"
        ref={dropdownRef}
        data-cy="Brushes-Dropdown"
      >
        <div className={css['grid']}>
          <button className={css['button']}>
            <img draggable="false" src={brush32} alt=""/>
          </button>

          <button className={css['button']}>
            <img draggable="false" src={calligraphy132} alt=""/>
          </button>

          <button className={css['button']}>
            <img draggable="false" src={calligraphy232} alt=""/>
          </button>

          <button className={css['button']}>
            <img draggable="false" src={air32} alt=""/>
          </button>

          <button className={css['button']}>
            <img draggable="false" src={oil32} alt=""/>
          </button>

          <button className={css['button']}>
            <img draggable="false" src={crayon32} alt=""/>
          </button>

          <button className={css['button']}>
            <img draggable="false" src={marker32} alt=""/>
          </button>

          <button className={css['button']}>
            <img draggable="false" src={pencil32} alt=""/>
          </button>

          <button className={css['button']}>
            <img draggable="false" src={water32} alt=""/>
          </button>
        </div>
      </div>
    </BigButtonDuo>
  );
}

export default RibbonBrushes;