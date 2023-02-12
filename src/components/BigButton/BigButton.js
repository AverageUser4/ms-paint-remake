import React from "react";
import PropTypes from "prop-types";
import css from './BigButton.module.css';

import { ReactComponent as TriangleDown } from '../../assets/global/triangle-down.svg';

function BigButton({ name, icon, backgroundColor = '#ff00ff', iconSize = '', hasArrow = true, children, showChildren }) {
  const buttonClasses = `${css['button']} ${css[`button--${iconSize}`]}`;
  let iconClasses = `${css['icon']} ${css[`icon--${iconSize}`]}`;

  if(!icon)
    iconClasses += !icon ? ` ${css['icon--only-color']}` : '';
  
  return (
    <div className={css['container']}>
      <button className={buttonClasses}>

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
        showChildren &&
          <div className={css['children-container']}>
            {children}
          </div>
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
  children: PropTypes.element,
  showChildren: PropTypes.bool
};

export default BigButton;