import React from "react";
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
            <RibbonItem backgroundColor="red" hasArrow={false} name={<span>Color <div className="line-break"></div> 1</span>}/>
            <RibbonItem backgroundColor="blue" hasArrow={false} name={<span>Color <div className="line-break"></div> 2</span>} iconSize="small"/>

            <div className={css['colors-grid']}>
              {colorsTemp}
            </div>

            <RibbonItem icon={colors32} hasArrow={false} name={<span>Edit <div className="line-break"></div> colors</span>}/>
          </div>

      </RibbonItemExpanded>
    </RibbonItemContainer>
  );
}

export default RibbonColors;