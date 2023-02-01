import React from "react";
import css from './RibbonShapes.module.css';
import shapes from '../../assets/Ribbon/shapes.png';
import triangleDown from '../../assets/global/triangle-down.png';

function Clipboard() {
  return (
    <button className="ribbon-item">

      <div className="ribbon-item__image-container">
        <img src={shapes}/>
      </div>

      <span className="text text--ribbon-item">Shapes</span>

      <img className="ribbon-item__triangle" src={triangleDown}/>

    </button>
  );
}

export default Clipboard;