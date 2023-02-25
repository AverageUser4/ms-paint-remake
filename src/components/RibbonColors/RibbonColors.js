import React, { useState } from "react";
import PropTypes from 'prop-types';
import css from './RibbonColors.module.css';

import BigButton from '../BigButton/BigButton';
import RibbonItemExpanded from "../RibbonItemExpanded/RibbonItemExpanded";
import RibbonItemContainer from "../RibbonItemContainer/RibbonItemContainer";

import { usePaintContext } from "../../misc/PaintContext";
import { RGBObjectToString } from "../../misc/utils";

import colors16 from './assets/colors-16.png';
import colors32 from './assets/colors-32.png';

function RibbonColors({ ribbonWidth, setIsColorsWindowOpen }) {
  const { colorData, setColorData } = usePaintContext();
  const isOnlyContent = ribbonWidth >= 725;

  const [colorsDataArray, setColorsDataArray] = useState([
    { r: 0, g: 0, b: 0 }, { r: 127, g: 127, b: 127 }, { r: 136, g: 0, b: 21 }, { r: 237, g: 28, b: 36 }, { r: 255, g: 127, b: 39 },
    { r: 255, g: 242, b: 0 }, { r: 34, g: 177, b: 76 }, { r: 0, g: 162, b: 232 }, { r: 63, g: 72, b: 204 }, { r: 163, g: 73, b: 164 },
    { r: 255, g: 255, b: 255 }, { r: 195, g: 195, b: 195 }, { r: 185, g: 122, b: 87 }, { r: 255, g: 174, b: 201 }, { r: 255, g: 201, b: 14 },
    { r: 239, g: 228, b: 176 }, { r: 181, g: 230, b: 29 }, { r: 153, g: 217, b: 234 }, { r: 112, g: 146, b: 190 }, { r: 200, g: 191, b: 231 }
  ]);
  
  const colorButtons = [];
  for(let i = 0; i < 30; i++) {
    const data = colorsDataArray[i];
    colorButtons.push(
      <button 
        key={i}
        data-color={data ? RGBObjectToString(data) : ''}
        style={{ color: data ? RGBObjectToString(data) : '' }}
        className={`${css['color']} ${data && css['color--has-color']}`}
        onClick={() => data && setColorData(prev => ({ ...prev, [prev.selected]: RGBObjectToString(data) }))}
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
              backgroundColor={colorData.primary}
              hasArrow={false}
              name={<div>Color <div className="line-break"></div> 1</div>}
              strName="Color-1"
              isActive={colorData.selected === 'primary'}
              onPointerDown={() => colorData.selected !== 'primary' && setColorData(prev => ({ ...prev, selected: 'primary' }))}
            />
            <BigButton 
              backgroundColor={colorData.secondary}
              hasArrow={false}
              name={<div>Color <div className="line-break"></div> 2</div>} 
              iconSize="small"
              strName="Color-2"
              isActive={colorData.selected === 'secondary'}
              onPointerDown={() => colorData.selected !== 'secondary' && setColorData(prev => ({ ...prev, selected: 'secondary' }))}
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
            />
          </div>

      </RibbonItemExpanded>
    </RibbonItemContainer>
  );
}

RibbonColors.propTypes = {
  ribbonWidth: PropTypes.number.isRequired,
  setIsColorsWindowOpen: PropTypes.func.isRequired,
};

export default RibbonColors;