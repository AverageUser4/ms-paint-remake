import React, { useEffect, useRef, useState } from "react";
import PropTypes from 'prop-types';
import css from './RibbonItemContainer.module.css';

import Dropdown from '../Dropdown/Dropdown';
import useOutsideClick from "../../hooks/useOutsideClick";
import { toggleBoolState } from "../../misc/utils";
import { useMainWindowContext } from "../../context/MainWindowContext";

import { ReactComponent as TriangleDown } from '../../assets/global/triangle-down.svg';
import Tooltip from "../Tooltip/Tooltip";

function RibbonItemContainer({ icon, name, children, isOnlyContent }) {
  const { isMainWindowFocused } = useMainWindowContext();
  const containerRef = useRef();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  useOutsideClick(containerRef, () => isDropdownOpen && setIsDropdownOpen(false));

  useEffect(() => {
    if(isDropdownOpen && isOnlyContent)
      setIsDropdownOpen(false);
  }, [isDropdownOpen, isOnlyContent]);

  useEffect(() => {
    if(isDropdownOpen && !isMainWindowFocused)
      setIsDropdownOpen(false);
  }, [isDropdownOpen, isMainWindowFocused]);

  if(isOnlyContent)
    return children;
  
  return (
    <div 
      className={`${css['container']} ${isDropdownOpen ? css['container--active'] : ''}`}
      ref={containerRef}
      data-cy={`RibbonItemContainer-${name}`}
    >

      <button 
        className={`tooltip-container ${css['button']}`}
        onPointerDown={(e) => e.button === 0 && toggleBoolState(isDropdownOpen, setIsDropdownOpen)}
      >

        <div className={css['image-container']}>
          <img draggable="false" src={icon} alt=""/>
        </div>

        <span className="text text--1">{name}</span>

        <TriangleDown className={css['triangle']}/>

        <Tooltip
          text={name}
        />

      </button>

      <Dropdown 
        isVisible={isDropdownOpen}
        setIsVisible={setIsDropdownOpen}
        classes={css['dropdown']}
        dropdownContainerRef={containerRef}
      >
        {children}
      </Dropdown>
      
    </div>
  );
}

RibbonItemContainer.propTypes = {
  name: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  isOnlyContent: PropTypes.bool.isRequired,
};

export default RibbonItemContainer;