import React from "react";
import css from './RibbonImage.module.css';
import image from '../../assets/Ribbon/image.png';
import triangleDown from '../../assets/global/triangle-down.png';

function Clipboard() {
  return (
    <button className="ribbon-item">

      <div className="ribbon-item__image-container">
        <img src={image}/>
      </div>

      <span className="text text--ribbon-item">Image</span>

      <img className="ribbon-item__triangle" src={triangleDown}/>

    </button>
  );
}

export default Clipboard;