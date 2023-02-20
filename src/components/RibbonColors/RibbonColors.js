import React from "react";
import PropTypes from 'prop-types';
import css from './RibbonColors.module.css';

import BigButton from '../BigButton/BigButton';
import RibbonItemExpanded from "../RibbonItemExpanded/RibbonItemExpanded";
import RibbonItemContainer from "../RibbonItemContainer/RibbonItemContainer";

import colors16 from './assets/colors-16.png';
import colors32 from './assets/colors-32.png';

function RibbonColors({ ribbonWidth, setIsColorsWindowOpen }) {
  const isOnlyContent = ribbonWidth >= 725;

  const colorsTemp = [];
  for(let i = 0; i < 30; i++) {
    colorsTemp.push(<button key={i} className={css['color']}></button>);
  }
  
  return (
    <RibbonItemContainer isOnlyContent={isOnlyContent} icon={colors16} name="Colors">
      <RibbonItemExpanded name="Colors">

          <div className={css['container']}>
            <BigButton 
              backgroundColor="red"
              hasArrow={false}
              name={<div>Color <div className="line-break"></div> 1</div>}
              strName="Color-1"
            />
            <BigButton 
              backgroundColor="blue"
              hasArrow={false}
              name={<div>Color <div className="line-break"></div> 2</div>} 
              iconSize="small"
              strName="Color-2"
            />

            <div className={css['colors-grid']}>
              {colorsTemp}
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