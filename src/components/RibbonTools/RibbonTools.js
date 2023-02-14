import React from "react";
import PropTypes from 'prop-types';
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

function RibbonTools({ ribbonWidth }) {
  const isOnlyContent = ribbonWidth >= 760;

  return (
    <RibbonItemContainer isOnlyContent={isOnlyContent} icon={tools16} name="Tools">
      <RibbonItemExpanded name="Tools">

        <div className={css['container']}>
          <button className="button">
            <img draggable="false" src={pencil16} alt="Pencil."/>
          </button>

          <button className="button">
            <img draggable="false" src={fill16} alt="Fill color."/>
          </button>

          <button className="button">
            <img draggable="false" src={text16} alt="Text."/>
          </button>

          <button className="button">
            <img draggable="false" src={eraser16} alt="Eraser."/>
          </button>

          <button className="button">
            <img draggable="false" src={colorPicker16} alt="Color picker."/>
          </button>

          <button className="button">
            <img draggable="false" src={magnifier16} alt="Magnifier."/>
          </button>
        </div>

      </RibbonItemExpanded>

      <div className="vertical-line"></div>

    </RibbonItemContainer>
  );
}

RibbonTools.propTypes = {
  ribbonWidth: PropTypes.number.isRequired,
};

export default RibbonTools;