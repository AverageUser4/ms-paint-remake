import React from "react";
import css from './RibbonItemContainer.module.css';
import triangleDown from '../../assets/global/triangle-down.png';

function RibbonItemContainer({ icon, name, children }) {
  if(children)
    return children;
  
  return (
    <button className={css['container']}>

      <div className={css['image-container']}>
        <img draggable="false" src={icon} alt=""/>
      </div>

      <span className="text text--1">{name}</span>

      <img draggable="false" className={css['triangle']} src={triangleDown} alt=""/>

    </button>
  );
}

export default RibbonItemContainer;