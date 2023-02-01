
import React from "react";
import css from './RibbonSize.module.css';
import triangleDown from '../../assets/global/triangle-down.png';
import size from '../../assets/Ribbon/size.png';

function RibbonSize() {
  return (
    <button className={`${css['container']} ${css['container--active']}`}>

      <img className={css['image']} src={size}/>

      <span className="text text--1">Size</span>
      <img className={css['triangle']} src={triangleDown}/>

    </button>
  );
}

export default RibbonSize;