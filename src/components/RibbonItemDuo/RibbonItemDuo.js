
import React from "react";
import css from './RibbonItemDuo.module.css';
import triangleDown from '../../assets/global/triangle-down.png';

function RibbonItemDuo({ name, icon }) {
  return (
    <div className={`${css['container']} ${css['container--active']}`}>

      <button className={css['top']}>
        <img draggable="false" className={css['image']} src={icon} alt=""/>
      </button>

      <button className={css['bottom']}>
        <span className="text text--1">{name}</span>
        <img draggable="false" className={css['triangle']} src={triangleDown} alt=""/>
      </button>

    </div>
  );
}

export default RibbonItemDuo;