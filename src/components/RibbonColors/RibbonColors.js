import React from "react";
import css from './RibbonColors.module.css';
import colors from '../../assets/Ribbon/colors.png';
import triangleDown from '../../assets/global/triangle-down.png';

function Clipboard() {
  return (
    <button className="ribbon-item">

      <div className="ribbon-item__image-container">
        <img src={colors}/>
      </div>

      <span className="text text--ribbon-item">Colors</span>

      <img className="ribbon-item__triangle" src={triangleDown}/>

    </button>
  );
}

export default Clipboard;