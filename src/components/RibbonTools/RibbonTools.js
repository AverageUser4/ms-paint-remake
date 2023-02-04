import React from "react";
import css from './RibbonTools.module.css';

import RibbonItemExpanded from "../RibbonItemExpanded/RibbonItemExpanded";
import RibbonItemContainer from "../RibbonItemContainer/RibbonItemContainer";

import tools16 from './assets/tools-16.png';
import pencil16 from './assets/pencil-16.png';
import fill16 from './assets/fill-16.png';
import text16 from './assets/text-16.png';
import eraser16 from './assets/eraser-16.png';
import colorPicker16 from './assets/color-picker-16.png';
import magnifier16 from './assets/magnifier-16.png';

function RibbonTools() {
  return (
    <RibbonItemContainer icon={tools16} name="Tools">
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
    </RibbonItemContainer>
  );
}

export default RibbonTools;