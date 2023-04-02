import React, { memo, useState } from "react";
import PropTypes from 'prop-types';
import css from './RibbonColors.module.css';

import BigButton from '../BigButton/BigButton';
import RibbonItemExpanded from "../RibbonItemExpanded/RibbonItemExpanded";
import RibbonItemContainer from "../RibbonItemContainer/RibbonItemContainer";
import Tooltip from "../Tooltip/Tooltip";

import { useWindowsContext } from "../../context/WindowsContext";
import { useColorContext } from "../../context/ColorContext";
import { useCanvasContext } from "../../context/CanvasContext";
import { RGBObjectToString } from "../../misc/utils";

import colors16 from './assets/colors-16.png';
import colors32 from './assets/colors-32.png';

const RibbonColors = memo(function RibbonColors({ ribbonWidth }) {
  const { setIsColorsWindowOpen } = useWindowsContext();
  const { colorData, setColorData, ribbonColorsArray } = useColorContext();
  const { isBlackAndWhite } = useCanvasContext();
  const [isContainerDropdownOpen, setIsContainerDropdownOpen] = useState(false);
  const isOnlyContent = ribbonWidth >= 725;
  
  const colorButtonsArray = [];
  for(let i = 0; i < 30; i++) {
    const data = ribbonColorsArray[i];
    colorButtonsArray.push(
      <button 
        key={i}
        data-color={data ? RGBObjectToString(data) : ''}
        style={{ color: data ? RGBObjectToString(data) : '' }}
        className={
          `${css['color']}
          ${data && css['color--has-color']}
          ${isBlackAndWhite && css['color--black-and-white']}
        `}
        onClick={() => {
          if(data) {
            setColorData(prev => ({ ...prev, [prev.selected]: data }));
            setIsContainerDropdownOpen(false);
          }
        }}
      ></button>
    );
  }
  
  return (
    <RibbonItemContainer 
      isOnlyContent={isOnlyContent}
      iconSrc={colors16}
      name="Colors"
      isDropdownOpen={isContainerDropdownOpen}
      setIsDropdownOpen={setIsContainerDropdownOpen}
    >
      <RibbonItemExpanded name="Colors">

          <div 
            className={css['container']}
            data-cy="Colors"
          >
            <BigButton 
              backgroundColor={RGBObjectToString(colorData.primary)}
              name={<div>Color <div className="line-break"></div> 1</div>}
              strName="Color-1"
              isActive={colorData.selected === 'primary'}
              onClick={() => {
                if(colorData.selected !== 'primary') {
                  setColorData(prev => ({ ...prev, selected: 'primary' }));
                }
                setIsContainerDropdownOpen(false);
              }}
              ariaDescribedBy="id-colors-color-1"
              tooltipElement={
                <Tooltip
                  ID="id-colors-color-1"
                  heading="Color 1 (foreground color)"
                  text="Click here and then select a color from the color palette. This color is used with the pencil and with brushes, as well as for shape outlines."
                />
              }
              isBlackAndWhite={isBlackAndWhite}
            />
            <BigButton 
              backgroundColor={RGBObjectToString(colorData.secondary)}
              name={<div>Color <div className="line-break"></div> 2</div>} 
              iconSize="small"
              strName="Color-2"
              isActive={colorData.selected === 'secondary'}
              onClick={() => { 
                if(colorData.selected !== 'secondary') {
                  setColorData(prev => ({ ...prev, selected: 'secondary' }));
                }
                setIsContainerDropdownOpen(false);
              }}
              ariaDescribedBy="id-colors-color-2"
              tooltipElement={
                <Tooltip
                  ID="id-colors-color-2"
                  heading="Color 2 (background color)"
                  text="Click here and then select a color from the color palette. This color is used with the eraser and for shape fills."
                />
              }
              isBlackAndWhite={isBlackAndWhite}
            />

            <div 
              className={css['colors-grid']}
              data-cy="Colors-grid"
            >
              {colorButtonsArray}
            </div>

            <BigButton 
              iconSrc={colors32}
              name={<div>Edit <div className="line-break"></div> colors</div>}
              strName="Edit-colors"
              onClick={() => { 
                setIsColorsWindowOpen(true);
                setIsContainerDropdownOpen(false);
              }}
              ariaDescribedBy="id-colors-edit-color"
              tooltipElement={
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
});

RibbonColors.propTypes = {
  ribbonWidth: PropTypes.number.isRequired,
};

export default RibbonColors;