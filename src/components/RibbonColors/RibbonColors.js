import React from "react";
import PropTypes from 'prop-types';
import css from './RibbonColors.module.css';

import RibbonItem from '../RibbonItem/RibbonItem';
import RibbonItemExpanded from "../RibbonItemExpanded/RibbonItemExpanded";
import RibbonItemContainer from "../RibbonItemContainer/RibbonItemContainer";

import colors16 from './assets/colors-16.png';
import colors32 from './assets/colors-32.png';

function RibbonColors({ ribbonWidth }) {
  const showContent = ribbonWidth >= 725;

  const colorsTemp = [];
  for(let i = 0; i < 30; i++) {
    colorsTemp.push(<button key={i} className={css['color']}></button>);
  }
  
  return (
    <RibbonItemContainer showContent={showContent} icon={colors16} name="Colors">
      <RibbonItemExpanded name="Colors">

          <div className={css['container']}>
            <RibbonItem backgroundColor="red" hasArrow={false} name={<div>Color <div className="line-break"></div> 1</div>}/>
            <RibbonItem backgroundColor="blue" hasArrow={false} name={<div>Color <div className="line-break"></div> 2</div>} iconSize="small"/>

            <div className={css['colors-grid']}>
              {colorsTemp}
            </div>

            <RibbonItem icon={colors32} hasArrow={false} name={<div>Edit <div className="line-break"></div> colors</div>}/>
          </div>

      </RibbonItemExpanded>
    </RibbonItemContainer>
  );
}

RibbonColors.propTypes = {
  ribbonWidth: PropTypes.number,
};

export default RibbonColors;