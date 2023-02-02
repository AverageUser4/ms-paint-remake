
import React from "react";
import css from './RibbonItemDuo.module.css';
import triangleDown from '../../assets/global/triangle-down.png';

function RibbonBrushes({ name, icon }) {
  return (
    <button className={`${css['container']} ${css['container--active']}`}>

      <div className={css['top']}>
        <img className={css['image']} src={icon}/>
      </div>

      <div className={css['bottom']}>
        <span className="text text--1">{name}</span>
        <img className={css['triangle']} src={triangleDown}/>
      </div>

    </button>
  );
}

export default RibbonBrushes;