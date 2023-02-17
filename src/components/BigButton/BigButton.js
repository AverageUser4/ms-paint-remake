import React, { useRef } from "react";
import PropTypes from "prop-types";
import css from './BigButton.module.css';

import Dropdown from "../Dropdown/Dropdown";

import { ReactComponent as TriangleDown } from '../../assets/global/triangle-down.svg';

function BigButton({ 
  name,
  icon,
  backgroundColor = '#ff00ff',
  iconSize = '',
  hasArrow = true,
  children,
  showChildren = false,
  onPointerDown,
  isOnlyChildren = false
}) {
  const dropdownContainerRef = useRef();
  const buttonClasses = `${css['button']} ${css[`button--${iconSize}`]}`;
  let iconClasses = `${css['icon']} ${css[`icon--${iconSize}`]}`;

  if(!icon)
    iconClasses += !icon ? ` ${css['icon--only-color']}` : '';

  if(isOnlyChildren)
    return children;
  
  return (
    <div className={css['container']} ref={dropdownContainerRef}>
      <button 
        className={buttonClasses}
        onPointerDown={onPointerDown ? onPointerDown : ()=>0}
      >

        {
          icon ?
            <img draggable="false" className={iconClasses} src={icon} alt=""/>
          :
            <div style={{ color: backgroundColor }} className={iconClasses}></div>
        }

        <span className="text text--1">{name}</span>

        {hasArrow && <TriangleDown className={css['triangle']}/>}

      </button>

      {
        children &&
          <Dropdown 
            isVisible={showChildren}
            dropdownContainerRef={dropdownContainerRef}
          >
            {children}
          </Dropdown>
      }
    </div>
  );
}

BigButton.propTypes = {
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  icon: PropTypes.string,
  backgroundColor: PropTypes.string,
  iconSize: PropTypes.oneOf(['', 'small']),
  hasArrow: PropTypes.bool,
  children: PropTypes.node,
  showChildren: PropTypes.bool,
  onPointerDown: PropTypes.func,
  isOnlyChildren: PropTypes.bool,
};

export default BigButton;