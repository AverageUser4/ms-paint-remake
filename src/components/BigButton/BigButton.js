import React, { useRef } from "react";
import PropTypes from "prop-types";
import css from './BigButton.module.css';

import Dropdown from "../Dropdown/Dropdown";

import { ReactComponent as TriangleDown } from '../../assets/global/triangle-down.svg';

function BigButton({ 
  name,
  strName,
  iconSrc,
  iconSize = '',
  backgroundColor = '#ff00ff',
  children,
  onClick,
  tooltipElement,
  ariaDescribedBy,
  isShowChildren = false, setIsShowChildren,
  isOnlyChildren = false,
  isActive,
  isDisabled,
  isBlackAndWhite,
  isHasArrow,
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

  if(!iconSrc)
    iconClasses += !iconSrc ? ` ${css['icon--only-color']}` : '';

  if(isOnlyChildren)
    return children;
  
  return (
    <div 
      className={css['container']}
      ref={dropdownContainerRef}
      data-cy={`BigButton-${strName}`}
    >
      <button
        tabIndex={isDisabled ? -1 : 0}
        className={buttonClasses}
        onClick={onClick && !isDisabled ? onClick : ()=>0}
        aria-describedby={ariaDescribedBy}
      >

        {
          iconSrc ?
            <img draggable="false" className={iconClasses} src={iconSrc} alt=""/>
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

        {isHasArrow && <TriangleDown className={css['triangle']}/>}

        {tooltipElement && tooltipElement}

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

BigButton.propTypes = {
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  strName: PropTypes.string.isRequired,
  iconSrc: PropTypes.string,
  backgroundColor: PropTypes.string,
  iconSize: PropTypes.oneOf(['', 'small']),
  isHasArrow: PropTypes.bool,
  children: PropTypes.node,
  isShowChildren: PropTypes.bool,
  setIsShowChildren: PropTypes.func,
  onClick: PropTypes.func,
  isOnlyChildren: PropTypes.bool,
  isActive: PropTypes.bool,
  isDisabled: PropTypes.bool,
  tooltipElement: PropTypes.element,
  ariaDescribedBy: PropTypes.string,
  isBlackAndWhite: PropTypes.bool,
};

export default BigButton;