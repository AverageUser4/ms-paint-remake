import React, { useRef } from "react";
import PropTypes from "prop-types";
import css from './BigButton.module.css';

import Dropdown from "../Dropdown/Dropdown";

import { ReactComponent as TriangleDown } from '../../assets/global/triangle-down.svg';

function BigButton({ 
  name,
  strName,
  icon,
  backgroundColor = '#ff00ff',
  iconSize = '',
  hasArrow = true,
  children,
  showChildren = false,
  setShowChildren,
  onPointerDown,
  isOnlyChildren = false,
  isActive,
}) {
  const dropdownContainerRef = useRef();
  const buttonClasses = `
    ${css['button']}
    ${css[`button--${iconSize}`]}
    ${isActive && css['button--active']}
  `;
  let iconClasses = `${css['icon']} ${css[`icon--${iconSize}`]}`;

  if(!icon)
    iconClasses += !icon ? ` ${css['icon--only-color']}` : '';

  if(isOnlyChildren)
    return children;
  
  return (
    <div 
      className={css['container']}
      ref={dropdownContainerRef}
      data-cy={`BigButton-${strName}`}
    >
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
            setIsVisible={setShowChildren}
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
  strName: PropTypes.string.isRequired,
  icon: PropTypes.string,
  backgroundColor: PropTypes.string,
  iconSize: PropTypes.oneOf(['', 'small']),
  hasArrow: PropTypes.bool,
  children: PropTypes.node,
  showChildren: PropTypes.bool,
  setShowChildren: PropTypes.func,
  onPointerDown: PropTypes.func,
  isOnlyChildren: PropTypes.bool,
  isActive: PropTypes.bool
};

export default BigButton;