
import React, { useRef } from "react";
import PropTypes from 'prop-types';
import css from './BigButtonDuo.module.css';

import Dropdown from "../Dropdown/Dropdown";

import { ReactComponent as TriangleDown } from '../../assets/global/triangle-down.svg';

function BigButtonDuo({ 
  name,
  icon,
  onClickTop,
  onClickBottom,
  children,
  showChildren = false,
  setShowChildren,
  isActive,
  tooltipTop,
  tooltipBottom,
  describedByTop,
  describedByBottom,
}) {
  const dropdownContainerRef = useRef();
  
  return (
    <div 
      className={`${css['container']} ${isActive && css['container--active']}`} 
      ref={dropdownContainerRef}
      data-cy={`BigButtonDuo-${name}`}
    >
      <button 
        className={`tooltip-container ${css['top']}`}
        onClick={onClickTop ? onClickTop : ()=>0}
        aria-describedby={describedByTop}
      >
        <img draggable="false" className={css['image']} src={icon} alt=""/>
        {tooltipTop && tooltipTop}
      </button>

      <button 
        className={`tooltip-container ${css['bottom']}`}
        onClick={onClickBottom ? onClickBottom : ()=>0}
        data-cy={`BigButtonDuo-bottom-${name}`}
        aria-describedby={describedByBottom}
      >
        <span className="text text--1">{name}</span>
        <TriangleDown className={css['triangle']}/>
        {tooltipBottom && tooltipBottom}
      </button>
      
      {
        children &&
          <Dropdown 
            isVisible={showChildren}
            setIsVisible={setShowChildren}
            dropdownContainerRef={dropdownContainerRef}
          >
            {children}
          </Dropdown>
      }
    </div>
  );
}

BigButtonDuo.propTypes = {
  name: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  onClickTop: PropTypes.func,
  onClickBottom: PropTypes.func,
  children: PropTypes.node,
  showChildren: PropTypes.bool,
  setShowChildren: PropTypes.func,
  isActive: PropTypes.bool,
  tooltipTop: PropTypes.node,
  tooltipBottom: PropTypes.node,
  describedByTop: PropTypes.string,
  describedByBottom: PropTypes.string,
};

export default BigButtonDuo;