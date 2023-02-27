import React, { useRef, useState } from "react";
import css from './RibbonBrushes.module.css';

import BigButtonDuo from "../BigButtonDuo/BigButtonDuo";
import useOutsideClick from "../../hooks/useOutsideClick";
import { toggleBoolState } from "../../misc/utils";
import { usePaintContext } from "../../misc/PaintContext";

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
  const { currentTool, setCurrentTool } = usePaintContext();
  useOutsideClick(dropdownRef, () => isDropdownOpen && setIsDropdownOpen(false));

  let icon = brush32;

  switch(currentTool) {
    case 'brushes-calligraphy-1':
        icon = calligraphy132;
        break;

    case 'brushes-calligraphy-2':
      icon = calligraphy232;
      break;

    case 'brushes-airbrush':
      icon = air32;
      break;

    case 'brushes-oilbrush':
      icon = oil32;
      break;

    case 'brushes-crayon':
      icon = crayon32;
      break;

    case 'brushes-marker':
      icon = marker32;
      break;

    case 'brushes-natural-pencil':
      icon = pencil32;
      break;

    case 'brushes-watercolor':
      icon = water32;
      break;
  }
  
  return (
    <BigButtonDuo 
      icon={icon} 
      name="Brushes"
      showChildren={isDropdownOpen}
      setShowChildren={setIsDropdownOpen}
      onPointerDownBottom={(e) => e.button === 0 && toggleBoolState(isDropdownOpen, setIsDropdownOpen)}
      isActive={currentTool.startsWith('brushes-')}
    >
      <div 
        className="popup"
        ref={dropdownRef}
        data-cy="Brushes-Dropdown"
      >
        <div className={css['grid']}>
          <button 
            className={`${css['button']} ${currentTool === 'brushes-brush' && css['button--active']}`}
            onClick={() => { 
              setCurrentTool('brushes-brush');
              setIsDropdownOpen(false);
            }}
          >
            <img draggable="false" src={brush32} alt=""/>
          </button>

          <button 
            className={`${css['button']} ${currentTool === 'brushes-calligraphy-1' && css['button--active']}`}
            onClick={() => { 
              setCurrentTool('brushes-calligraphy-1');
              setIsDropdownOpen(false);
            }}
          >
            <img draggable="false" src={calligraphy132} alt=""/>
          </button>

          <button 
            className={`${css['button']} ${currentTool === 'brushes-calligraphy-2' && css['button--active']}`}
            onClick={() => { 
              setCurrentTool('brushes-calligraphy-2');
              setIsDropdownOpen(false);
            }}
          >
            <img draggable="false" src={calligraphy232} alt=""/>
          </button>

          <button 
            className={`${css['button']} ${currentTool === 'brushes-airbrush' && css['button--active']}`}
            onClick={() => { 
              setCurrentTool('brushes-airbrush');
              setIsDropdownOpen(false);
            }}
          >
            <img draggable="false" src={air32} alt=""/>
          </button>

          <button 
            className={`${css['button']} ${currentTool === 'brushes-oilbrush' && css['button--active']}`}
            onClick={() => { 
              setCurrentTool('brushes-oilbrush');
              setIsDropdownOpen(false);
            }}
          >
            <img draggable="false" src={oil32} alt=""/>
          </button>

          <button 
            className={`${css['button']} ${currentTool === 'brushes-crayon' && css['button--active']}`}
            onClick={() => { 
              setCurrentTool('brushes-crayon');
              setIsDropdownOpen(false);
            }}
          >
            <img draggable="false" src={crayon32} alt=""/>
          </button>

          <button 
            className={`${css['button']} ${currentTool === 'brushes-marker' && css['button--active']}`}
            onClick={() => { 
              setCurrentTool('brushes-marker');
              setIsDropdownOpen(false);
            }}
          >
            <img draggable="false" src={marker32} alt=""/>
          </button>

          <button 
            className={`${css['button']} ${currentTool === 'brushes-natural-pencil' && css['button--active']}`}
            onClick={() => { 
              setCurrentTool('brushes-natural-pencil');
              setIsDropdownOpen(false);
            }}
          >
            <img draggable="false" src={pencil32} alt=""/>
          </button>

          <button 
            className={`${css['button']} ${currentTool === 'brushes-watercolor' && css['button--active']}`}
            onClick={() => { 
              setCurrentTool('brushes-watercolor');
              setIsDropdownOpen(false);
            }}
          >
            <img draggable="false" src={water32} alt=""/>
          </button>
        </div>
      </div>
    </BigButtonDuo>
  );
}

export default RibbonBrushes;