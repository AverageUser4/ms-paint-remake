import React from "react";
import css from './RibbonItem.module.css';

import { ReactComponent as TriangleDown } from '../../assets/global/triangle-down.svg';

function RibbonItem({ name, icon, backgroundColor = '#ff00ff', iconSize = '', hasArrow = true }) {
  const containerClasses = `${css['container']} ${css[`container--${iconSize}`]}`;
  let iconClasses = `${css['icon']} ${css[`icon--${iconSize}`]}`;

  if(!icon)
    iconClasses += !icon ? ` ${css['icon--only-color']}` : '';
  
  return (
    <button className={containerClasses}>

      {
        icon ?
          <img draggable="false" className={iconClasses} src={icon} alt=""/>
        :
          <div style={{ color: backgroundColor }} className={iconClasses}></div>
      }

      <span className="text text--1">{name}</span>

      {hasArrow && <TriangleDown className={css['triangle']}/>}

    </button>
  );
}

export default RibbonItem;