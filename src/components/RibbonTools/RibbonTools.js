import React from "react";
import css from './RibbonTools.module.css';
import tools from '../../assets/Ribbon/tools.png';
import triangleDown from '../../assets/global/triangle-down.png';

function Clipboard() {
  return (
    <button className="ribbon-item">

      <div className="ribbon-item__image-container">
        <img src={tools}/>
      </div>

      <span className="text text--ribbon-item">Tools</span>

      <img className="ribbon-item__triangle" src={triangleDown}/>

    </button>
  );
}

export default Clipboard;