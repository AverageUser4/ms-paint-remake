import React, { useState, useRef, memo } from "react";
import css from './RibbonSize.module.css';

import BigButton from "../BigButton/BigButton";
import Tooltip from "../Tooltip/Tooltip";

import useOutsideClick from '../../hooks/useOutsideClick';
import { toggleBoolState } from "../../misc/utils";
import { useToolContext } from "../../context/ToolContext";

import size32 from './assets/size-32.png';

const RibbonSize = memo(function RibbonSize() {
  const { toolsData, setToolsData, currentTool } = useToolContext();
  const dropdownRef = useRef();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  useOutsideClick(dropdownRef, () => isDropdownOpen && setIsDropdownOpen(false));
  const { sizes } = toolsData.get(currentTool);

  return (
    <BigButton 
      iconSrc={size32}
      name="Size"
      strName="Size"
      isShowChildren={isDropdownOpen}
      setIsShowChildren={setIsDropdownOpen}
      onClick={(e) => e.button === 0 && toggleBoolState(isDropdownOpen, setIsDropdownOpen)}
      isDisabled={!sizes}
      isHasArrow={true}
      ariaDescribedBy="id-size-big-button"
      tooltipElement={
        <Tooltip
          ID="id-size-big-button"
          heading="Size (Ctrl++, Ctrl+-)"
          text="Select the width for the selected tool."
        />
      }
    >
      {
        sizes &&
          <div 
            className={css['container']}
            ref={dropdownRef}
            data-cy="Size-Dropdown"
          >
            {
              sizes.map((size, index) => 
                <button 
                  key={size}
                  className={`tooltip-container ${css['button']} ${index === toolsData.get(currentTool).chosenSizeIndex ? css['button--active'] : ''}`}
                  onClick={() => {
                    setToolsData(prev => {
                      const newToolsData = new Map(prev);
                      const newTool = { ...newToolsData.get(currentTool) };
                      newTool.chosenSizeIndex = index;
                      newToolsData.set(currentTool, newTool);
                      return newToolsData;
                    });
                    setIsDropdownOpen(false);
                  }}
                  aria-label={`${size} pixels`}
                >
                  <div className={css['size']} style={{ height: size < 20 ? size : Math.round(size / 1.4) }}></div>
                  <Tooltip
                    text={`${size}px`}
                  />
                </button>)
            }
          </div>
      }
    </BigButton>
  );
});

export default RibbonSize;