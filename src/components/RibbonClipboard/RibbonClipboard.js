import React from "react";
import css from './RibbonClipboard.module.css';
import paste from '../../assets/Ribbon/paste.png';
import triangleDown from '../../assets/global/triangle-down.png';

function Clipboard() {
  return (
    <button className="ribbon-item">

      <div className="ribbon-item__image-container">
        <img src={paste}/>
      </div>

      <span className="text text--ribbon-item">Clipboard</span>

      <img className="ribbon-item__triangle" src={triangleDown}/>

    </button>
  );
}

export default Clipboard;