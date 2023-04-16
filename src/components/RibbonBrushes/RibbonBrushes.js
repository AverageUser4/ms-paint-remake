import React, { memo, useRef, useState } from "react";
import css from './RibbonBrushes.module.css';

import BigButtonDuo from "../BigButtonDuo/BigButtonDuo";
import Tooltip from "../Tooltip/Tooltip";

import useOutsideClick from "../../hooks/useOutsideClick";
import { useToolContext } from "../../context/ToolContext";
import { useSelectionContext } from "../../context/SelectionContext";

import air32 from './assets/air-32.png';
import brush32 from './assets/brush-32.png';
import calligraphy132 from './assets/calligraphy-1-32.png';
import calligraphy232 from './assets/calligraphy-2-32.png';
import crayon32 from './assets/crayon-32.png';
import marker32 from './assets/marker-32.png';
import oil32 from './assets/oil-32.png';
import pencil32 from './assets/pencil-32.png';
import water32 from './assets/water-32.png';

const RibbonBrushes = memo(function RibbonBrushes() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  const { currentTool, latestTools } = useToolContext();
  const { doSetCurrentTool } = useSelectionContext();
  useOutsideClick({
    containerRef: dropdownRef,
    callback: () => setIsDropdownOpen(false),
    isInvokeOnEscapeKey: true,
  });

  let icon = brush32;

  switch(currentTool.startsWith('brushes') ? currentTool : latestTools.brushes) {
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

  const brushesDataArray = [
    { id: 'brushes-brush', name: 'Brush', icon: brush32 },
    { id: 'brushes-calligraphy-1', name: 'Calligraphy brush 1', icon: calligraphy132 },
    { id: 'brushes-calligraphy-2', name: 'Calligraphy brush 2', icon: calligraphy232 },
    { id: 'brushes-airbrush', name: 'Airbrush', icon: air32 },
    { id: 'brushes-oilbrush', name: 'Oil brush', icon: oil32 },
    { id: 'brushes-crayon', name: 'Crayon', icon: crayon32 },
    { id: 'brushes-marker', name: 'Marker', icon: marker32 },
    { id: 'brushes-natural-pencil', name: 'Natural pencil', icon: pencil32 },
    { id: 'brushes-watercolor', name: 'Watercolor brush', icon: water32 },
  ];

  const brushesButtonsArray = brushesDataArray.map(data => (
    <button 
      key={data.id}
      className={
        `tooltip-container ${css['button']}
        ${currentTool === data.id && css['button--active']}
      `}
      onClick={() => { 
        doSetCurrentTool(data.id);
        setIsDropdownOpen(false);
      }}
      aria-label={data.name}
    >
      <img draggable="false" src={data.icon} alt=""/>
      <Tooltip
        text={data.name}
      />
    </button>
  ));
  
  
  return (
    <BigButtonDuo 
      iconSrc={icon} 
      name="Brushes"
      isShowChildren={isDropdownOpen}
      setIsShowChildren={setIsDropdownOpen}
      onClickBottom={(e) => e.button === 0 && setIsDropdownOpen(prev => !prev)}
      onClickTop={() => !currentTool.startsWith('brushes-') && doSetCurrentTool(latestTools.brushes)}
      isActive={currentTool.startsWith('brushes-')}
      ariaDescribedByTop="id-brushes-bbd-top"
      tooltipElementTop={
        <Tooltip
          ID="id-brushes-bbd-top"
          heading="Brushes"
          text="Draw with different kinds of brushes."
        />
      }
      ariaDescribedByBottom="id-brushes-bbd-bottom"
      tooltipElementBottom={
        <Tooltip
          ID="id-brushes-bbd-bottom"
          heading="Brushes"
          text="Draw with different kinds of brushes."
        />
      }
    >
      <div 
        className="popup"
        ref={dropdownRef}
        data-cy="Brushes-Dropdown"
      >
        <div className={css['grid']}>
          {brushesButtonsArray}
        </div>
      </div>
    </BigButtonDuo>
  );
});

export default RibbonBrushes;