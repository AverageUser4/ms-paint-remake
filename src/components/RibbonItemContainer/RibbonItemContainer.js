import React from "react";
import css from './RibbonItemContainer.module.css';
import triangleDown from '../../assets/global/triangle-down.png';

function RibbonItemContainer({ icon, name, children }) {
  if(children)
    return children;
  
  return (
    <button className={css['container']}>

      <div className={css['image-container']}>
        <img src={icon}/>
      </div>

      <span className="text text--1">{name}</span>

      <img className={css['triangle']} src={triangleDown}/>

    </button>
  );
}

export default RibbonItemContainer;