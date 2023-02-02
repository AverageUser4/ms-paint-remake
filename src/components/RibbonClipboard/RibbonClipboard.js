import React from "react";
import css from './RibbonClipboard.module.css';
import triangleDown from '../../assets/global/triangle-down.png';

function Clipboard() {
  return (
    <button className={css['container']}>

      <div className="ribbon-item__image-container">
      </div>

      <span className="text text--ribbon-item">Clipboard</span>

      <img className="ribbon-item__triangle" src={triangleDown}/>

    </button>
  );
}

export default Clipboard;