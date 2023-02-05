
import React from "react";
import css from './RibbonItemDuo.module.css';

import { ReactComponent as TriangleDown } from '../../assets/global/triangle-down.svg';

function RibbonItemDuo({ name, icon }) {
  return (
    <div className={`${css['container']} ${css['container--active']}`}>

      <button className={css['top']}>
        <img draggable="false" className={css['image']} src={icon} alt=""/>
      </button>

      <button className={css['bottom']}>
        <span className="text text--1">{name}</span>
        <TriangleDown className={css['triangle']}/>
      </button>

    </div>
  );
}

export default RibbonItemDuo;