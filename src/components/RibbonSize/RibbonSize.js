import React, { useState, useRef } from "react";
import css from './RibbonSize.module.css';

import BigButton from "../BigButton/BigButton";
import useOutsideClick from '../../hooks/useOutsideClick';
import { toggleBoolState } from "../../misc/utils";
import { useToolContext } from "../../misc/ToolContext";

import size32 from './assets/size-32.png';

function RibbonSize() {
  const { toolsData, setToolsData, currentTool } = useToolContext();
  const dropdownRef = useRef();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  useOutsideClick(dropdownRef, () => isDropdownOpen && setIsDropdownOpen(false));
  // will come from props
  const { sizes } = toolsData.get(currentTool);

  return (
    <BigButton 
      icon={size32}
      name="Size"
      strName="Size"
      showChildren={isDropdownOpen}
      setShowChildren={setIsDropdownOpen}
      onPointerDown={(e) => e.button === 0 && toggleBoolState(isDropdownOpen, setIsDropdownOpen)}
      isDisabled={!sizes}
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
                  className={`${css['button']} ${index === toolsData.get(currentTool).chosenSizeIndex ? css['button--active'] : ''}`}
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
                >
                  <div className={css['size']} style={{ height: size < 20 ? size : Math.round(size / 1.4) }}></div>
                </button>)
            }
          </div>
      }
    </BigButton>
  );
}

export default RibbonSize;