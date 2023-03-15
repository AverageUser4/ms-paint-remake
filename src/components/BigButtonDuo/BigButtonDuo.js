
import React, { useRef } from "react";
import PropTypes from 'prop-types';
import css from './BigButtonDuo.module.css';

import Dropdown from "../Dropdown/Dropdown";

import { ReactComponent as TriangleDown } from '../../assets/global/triangle-down.svg';

function BigButtonDuo({ 
  name,
  iconSrc,
  onClickTop,
  onClickBottom,
  children,
  tooltipElementTop,
  tooltipElementBottom,
  ariaDescribedByTop,
  ariaDescribedByBottom,
  isShowChildren = false, setIsShowChildren,
  isActive,
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
        aria-describedby={ariaDescribedByTop}
      >
        <img draggable="false" className={css['image']} src={iconSrc} alt=""/>
        {tooltipElementTop && tooltipElementTop}
      </button>

      <button 
        className={`tooltip-container ${css['bottom']}`}
        onClick={onClickBottom ? onClickBottom : ()=>0}
        data-cy={`BigButtonDuo-bottom-${name}`}
        aria-describedby={ariaDescribedByBottom}
      >
        <span className="text text--1">{name}</span>
        <TriangleDown className={css['triangle']}/>
        {tooltipElementBottom && tooltipElementBottom}
      </button>
      
      {
        children &&
          <Dropdown 
            isVisible={isShowChildren}
            setIsVisible={setIsShowChildren}
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
  iconSrc: PropTypes.string.isRequired,
  onClickTop: PropTypes.func,
  onClickBottom: PropTypes.func,
  children: PropTypes.node,
  isShowChildren: PropTypes.bool,
  setIsShowChildren: PropTypes.func,
  isActive: PropTypes.bool,
  tooltipElementTop: PropTypes.element.isRequired,
  tooltipElementBottom: PropTypes.element.isRequired,
  ariaDescribedByTop: PropTypes.string.isRequired,
  ariaDescribedByBottom: PropTypes.string.isRequired,
};

export default BigButtonDuo;