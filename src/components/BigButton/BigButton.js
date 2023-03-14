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
  onClick,
  isOnlyChildren = false,
  isActive,
  isDisabled,
  tooltip,
  describedBy,
  isBlackAndWhite,
}) {
  const dropdownContainerRef = useRef();
  const buttonClasses = `
    tooltip-container
    ${css['button']}
    ${css[`button--${iconSize}`]}
    ${isActive && css['button--active']}
    ${isDisabled && css['button--disabled']}
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
        onClick={onClick && !isDisabled ? onClick : ()=>0}
        aria-describedby={describedBy}
      >

        {
          icon ?
            <img draggable="false" className={iconClasses} src={icon} alt=""/>
          :
            <div 
              style={{ 
                color: backgroundColor,
                filter: isBlackAndWhite ? 'grayscale(100%)' : ''
              }}
              className={iconClasses}
            ></div>
        }

        <span className="text text--1">{name}</span>

        {hasArrow && <TriangleDown className={css['triangle']}/>}

        {tooltip && tooltip}

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
  onClick: PropTypes.func,
  isOnlyChildren: PropTypes.bool,
  isActive: PropTypes.bool,
  isDisabled: PropTypes.bool,
  tooltip: PropTypes.node,
  describedBy: PropTypes.string,
  isBlackAndWhite: PropTypes.bool,
};

export default BigButton;