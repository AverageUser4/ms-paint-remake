
import React from "react";
import css from './RibbonBrushes.module.css';
import triangleDown from '../../assets/global/triangle-down.png';
import brush from '../../assets/Ribbon/brush.png';

function RibbonBrushes() {
  return (
    <button className={`${css['container']} ${css['container--active']}`}>

      <div className={css['top']}>
        <img className={css['image']} src={brush}/>
      </div>

      <div className={css['bottom']}>
        <span className="text text--1">Brushes</span>
        <img className={css['triangle']} src={triangleDown}/>
      </div>

    </button>
  );
}

export default RibbonBrushes;