import React from "react";
import css from './RibbonTools.module.css';

import RibbonItemExpanded from "../RibbonItemExpanded/RibbonItemExpanded";

import pencil16 from '../../assets/RibbonTools/pencil-16.png';
import fill16 from '../../assets/RibbonTools/fill-16.png';
import text16 from '../../assets/RibbonTools/text-16.png';
import eraser16 from '../../assets/RibbonTools/eraser-16.png';
import colorPicker16 from '../../assets/RibbonTools/color-picker-16.png';
import magnifier16 from '../../assets/RibbonTools/magnifier-16.png';

function RibbonTools() {
  return (
    <RibbonItemExpanded name="Tools">

      <div className={css['container']}>
        <button className="button">
          <img src={pencil16} alt="Pencil."/>
        </button>

        <button className="button">
          <img src={fill16} alt="Fill color."/>
        </button>

        <button className="button">
          <img src={text16} alt="Text."/>
        </button>

        <button className="button">
          <img src={eraser16} alt="Eraser."/>
        </button>

        <button className="button">
          <img src={colorPicker16} alt="Color picker."/>
        </button>

        <button className="button">
          <img src={magnifier16} alt="Magnifier."/>
        </button>
      </div>

    </RibbonItemExpanded>
  );
}

export default RibbonTools;