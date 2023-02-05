import React from "react";
import css from './RibbonItem.module.css';
import triangleDown from '../../assets/global/triangle-down.png';

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

      {
        hasArrow &&
          <img draggable="false" className={css['triangle']} src={triangleDown} alt=""/>
      }

    </button>
  );
}

export default RibbonItem;