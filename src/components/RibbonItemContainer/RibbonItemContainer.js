import React, { useEffect, useRef } from "react";
import PropTypes from 'prop-types';
import css from './RibbonItemContainer.module.css';

import Dropdown from '../Dropdown/Dropdown';
import useOutsideClick from "../../hooks/useOutsideClick";
import { useMainWindowContext } from "../../context/MainWindowContext";

import { ReactComponent as TriangleDown } from '../../assets/global/triangle-down.svg';
import Tooltip from "../Tooltip/Tooltip";

function RibbonItemContainer({ isDropdownOpen, setIsDropdownOpen, iconSrc, name, children, isOnlyContent }) {
  const { isMainWindowFocused } = useMainWindowContext();
  const containerRef = useRef();
  useOutsideClick(containerRef, () => isDropdownOpen && setIsDropdownOpen(false));

  useEffect(() => {
    if(isDropdownOpen && isOnlyContent)
      setIsDropdownOpen(false);
  }, [isDropdownOpen, isOnlyContent, setIsDropdownOpen]);

  useEffect(() => {
    if(isDropdownOpen && !isMainWindowFocused)
      setIsDropdownOpen(false);
  }, [isDropdownOpen, isMainWindowFocused, setIsDropdownOpen]);

  if(isOnlyContent) {
    return children;
  }
  
  return (
    <div 
      className={`${css['container']} ${isDropdownOpen ? css['container--active'] : ''}`}
      ref={containerRef}
      data-cy={`RibbonItemContainer-${name}`}
    >

      <button 
        className={`tooltip-container ${css['button']}`}
        onClick={(e) => e.button === 0 && setIsDropdownOpen(prev => !prev)}
      >

        <div className={css['image-container']}>
          <img draggable="false" src={iconSrc} alt=""/>
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
  iconSrc: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  isOnlyContent: PropTypes.bool.isRequired,
  isDropdownOpen: PropTypes.bool.isRequired,
  setIsDropdownOpen: PropTypes.func.isRequired,
};

export default RibbonItemContainer;