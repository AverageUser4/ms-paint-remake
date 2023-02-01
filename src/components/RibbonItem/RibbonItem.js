import React from "react";
import css from './RibbonItem.module.css';
import triangleDown from '../../assets/global/triangle-down.png';

function RibbonItem({ icon, name, children }) {
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

export default RibbonItem;