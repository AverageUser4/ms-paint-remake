
import React from "react";
import css from './RibbonItemDuo.module.css';
import triangleDown from '../../assets/global/triangle-down.png';

function RibbonItemDuo({ name, icon }) {
  return (
    <div className={`${css['container']} ${css['container--active']}`}>

      <button className={css['top']}>
        <img className={css['image']} src={icon}/>
      </button>

      <button className={css['bottom']}>
        <span className="text text--1">{name}</span>
        <img className={css['triangle']} src={triangleDown}/>
      </button>

    </div>
  );
}

export default RibbonItemDuo;