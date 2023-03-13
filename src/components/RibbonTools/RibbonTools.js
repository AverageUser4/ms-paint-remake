import React from "react";
import PropTypes from 'prop-types';
import css from './RibbonTools.module.css';

import RibbonItemExpanded from "../RibbonItemExpanded/RibbonItemExpanded";
import RibbonItemContainer from "../RibbonItemContainer/RibbonItemContainer";
import Tooltip from "../Tooltip/Tooltip";
import { useToolContext } from "../../misc/ToolContext";

import tools16 from './assets/tools-16.png';
import pencil16 from './assets/pencil-16.png';
import fill16 from './assets/fill-16.png';
import text16 from './assets/text-16.png';
import eraser16 from './assets/eraser-16.png';
import colorPicker16 from './assets/color-picker-16.png';
import magnifier16 from './assets/magnifier-16.png';

function RibbonTools({ ribbonWidth }) {
  const isOnlyContent = ribbonWidth >= 760;
  const { currentTool, doSetCurrentTool } = useToolContext();

  return (
    <RibbonItemContainer isOnlyContent={isOnlyContent} icon={tools16} name="Tools">
      <RibbonItemExpanded name="Tools">

        <div 
          className={css['container']}
          data-cy="Tools"
        >
          <button
            className={`tooltip-container button ${currentTool === 'pencil' && 'button--active'}`}
            onClick={() => {
              doSetCurrentTool('pencil');
            }}
            aria-describedby="id-tools-pencil"
          >
            <img draggable="false" src={pencil16} alt="Pencil."/>
            <Tooltip
              ID="id-tools-pencil"
              heading="Pencil"
              text="Draw a free-form line with the selected line width."
            />
          </button>

          <button
            className={`tooltip-container button ${currentTool === 'fill' && 'button--active'}`}
            onClick={() => {
              doSetCurrentTool('fill');
            }}
            aria-describedby="id-tools-fill"
          >
            <img draggable="false" src={fill16} alt="Fill color."/>
            <Tooltip
              ID="id-tools-fill"
              heading="Fill with color"
              text="Click an area on the canvas to fill it with the foreground color, or right-click to fill it with the background color."
            />
          </button>

          <button
            className={`tooltip-container button ${currentTool === 'text' && 'button--active'}`}
            onClick={() => {
              doSetCurrentTool('text');
            }}
            aria-describedby="id-tools-text"
          >
            <img draggable="false" src={text16} alt="Text."/>
            <Tooltip
              ID="id-tools-text"
              heading="Text"
              text="Insert text into the picture."
            />
          </button>

          <button
            className={`tooltip-container button ${currentTool === 'eraser' && 'button--active'}`}
            onClick={() => {
              doSetCurrentTool('eraser');
            }}
            aria-describedby="id-tools-eraser"
          >
            <img draggable="false" src={eraser16} alt="Eraser."/>
            <Tooltip
              ID="id-tools-eraser"
              heading="Eraser"
              text="Erase part of the picture and replace it with the background color."
            />
          </button>

          <button
            className={`tooltip-container button ${currentTool === 'color-picker' && 'button--active'}`}
            onClick={() => {
              doSetCurrentTool('color-picker');
            }}
            aria-describedby="id-tools-color-picker"
          >
            <img draggable="false" src={colorPicker16} alt="Color picker."/>
            <Tooltip
              ID="id-tools-color-picker"
              heading="Color picker"
              text="Pick a color from the picture and use it for drawing."
            />
          </button>

          <button
            className={`tooltip-container button ${currentTool === 'magnifier' && 'button--active'}`}
            onClick={() => {
              doSetCurrentTool('magnifier');
            }}
            aria-describedby="id-tools-magnifier"
          >
            <img draggable="false" src={magnifier16} alt="Magnifier."/>
            <Tooltip
              ID="id-tools-magnifier"
              heading="Magnifier"
              text="Change the magnification for a part of the picture."
            />
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