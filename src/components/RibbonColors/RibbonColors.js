import React from "react";
import PropTypes from 'prop-types';
import css from './RibbonColors.module.css';

import BigButton from '../BigButton/BigButton';
import RibbonItemExpanded from "../RibbonItemExpanded/RibbonItemExpanded";
import RibbonItemContainer from "../RibbonItemContainer/RibbonItemContainer";
import Tooltip from "../Tooltip/Tooltip";

import { useWindowsContext } from "../../misc/WindowsContext";
import { useColorContext } from "../../misc/ColorContext";
import { RGBObjectToString } from "../../misc/utils";

import colors16 from './assets/colors-16.png';
import colors32 from './assets/colors-32.png';

function RibbonColors({ ribbonWidth }) {
  const { setIsColorsWindowOpen } = useWindowsContext();
  const { colorData, setColorData, ribbonColorsArray } = useColorContext();
  const isOnlyContent = ribbonWidth >= 725;
  
  const colorButtons = [];
  for(let i = 0; i < 30; i++) {
    const data = ribbonColorsArray[i];
    colorButtons.push(
      <button 
        key={i}
        data-color={data ? RGBObjectToString(data) : ''}
        style={{ color: data ? RGBObjectToString(data) : '' }}
        className={`${css['color']} ${data && css['color--has-color']}`}
        onClick={() => data && setColorData(prev => ({ ...prev, [prev.selected]: data }))}
      ></button>
    );
  }
  
  return (
    <RibbonItemContainer isOnlyContent={isOnlyContent} icon={colors16} name="Colors">
      <RibbonItemExpanded name="Colors">

          <div 
            className={css['container']}
            data-cy="Colors"
          >
            <BigButton 
              backgroundColor={RGBObjectToString(colorData.primary)}
              hasArrow={false}
              name={<div>Color <div className="line-break"></div> 1</div>}
              strName="Color-1"
              isActive={colorData.selected === 'primary'}
              onPointerDown={() => colorData.selected !== 'primary' && setColorData(prev => ({ ...prev, selected: 'primary' }))}
              describedBy="id-colors-color-1"
              tooltip={
                <Tooltip
                  ID="id-colors-color-1"
                  heading="Color 1 (foreground color)"
                  text="Click here and then select a color from the color palette. This color is used with the pencil and with brushes, as well as for shape outlines."
                />
              }
            />
            <BigButton 
              backgroundColor={RGBObjectToString(colorData.secondary)}
              hasArrow={false}
              name={<div>Color <div className="line-break"></div> 2</div>} 
              iconSize="small"
              strName="Color-2"
              isActive={colorData.selected === 'secondary'}
              onPointerDown={() => colorData.selected !== 'secondary' && setColorData(prev => ({ ...prev, selected: 'secondary' }))}
              describedBy="id-colors-color-2"
              tooltip={
                <Tooltip
                  ID="id-colors-color-2"
                  heading="Color 2 (background color)"
                  text="Click here and then select a color from the color palette. This color is used with the eraser and for shape fills."
                />
              }
            />

            <div 
              className={css['colors-grid']}
              data-cy="Colors-grid"
            >
              {colorButtons}
            </div>

            <BigButton 
              icon={colors32}
              hasArrow={false}
              name={<div>Edit <div className="line-break"></div> colors</div>}
              strName="Edit-colors"
              onPointerDown={() => setIsColorsWindowOpen(true)}
              describedBy="id-colors-edit-color"
              tooltip={
                <Tooltip
                  ID="id-colors-edit-color"
                  heading="Edit colors"
                  text="Select a color from the color palette."
                />
              }
            />
          </div>

      </RibbonItemExpanded>
    </RibbonItemContainer>
  );
}

RibbonColors.propTypes = {
  ribbonWidth: PropTypes.number.isRequired,
};

export default RibbonColors;