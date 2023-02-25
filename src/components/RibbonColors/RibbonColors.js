import React, { useState } from "react";
import PropTypes from 'prop-types';
import css from './RibbonColors.module.css';

import BigButton from '../BigButton/BigButton';
import RibbonItemExpanded from "../RibbonItemExpanded/RibbonItemExpanded";
import RibbonItemContainer from "../RibbonItemContainer/RibbonItemContainer";

import { usePaintContext } from "../../misc/PaintContext";

import colors16 from './assets/colors-16.png';
import colors32 from './assets/colors-32.png';

function RibbonColors({ ribbonWidth, setIsColorsWindowOpen }) {
  const { colorData, setColorData } = usePaintContext();
  const isOnlyContent = ribbonWidth >= 725;

  const [colorsDataArray, setColorsDataArray] = useState([
    'rgb(0, 0, 0)', 'rgb(127, 127, 127)', 'rgb(136, 0, 21)', 'rgb(237, 28, 36)', 'rgb(255, 127, 39)',
    'rgb(255, 242, 0)', 'rgb(34, 177, 76)', 'rgb(0, 162, 232)', 'rgb(63, 72, 204)', 'rgb(163, 73, 164)',
    'rgb(255, 255, 255)', 'rgb(195, 195, 195)', 'rgb(185, 122, 87)', 'rgb(255, 174, 201)', 'rgb(255, 201, 14)',
    'rgb(239, 228, 176)', 'rgb(181, 230, 29)', 'rgb(153, 217, 234)', 'rgb(112, 146, 190)', 'rgb(200, 191, 231)'
  ]);
  
  const colorButtons = [];
  for(let i = 0; i < 30; i++) {
    const data = colorsDataArray[i];
    colorButtons.push(
      <button 
        key={i}
        data-color={data}
        style={{ color: data }}
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