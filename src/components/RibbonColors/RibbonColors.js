import React from "react";
import css from './RibbonColors.module.css';

import RibbonItem from '../RibbonItem/RibbonItem';
import RibbonItemExpanded from "../RibbonItemExpanded/RibbonItemExpanded";

import colors32 from '../../assets/RibbonColors/colors-32.png';

function RibbonColors() {
  const colorsTemp = [];
  for(let i = 0; i < 30; i++) {
    colorsTemp.push(<button key={i} className={css['color']}></button>);
  }
  
  return (
    <RibbonItemExpanded name="Colors">

        <div className={css['container']}>
          <RibbonItem backgroundColor="red" hasArrow={false} name="Color 1"/>
          <RibbonItem backgroundColor="blue" hasArrow={false} name="Color 2" iconSize="small"/>

          <div className={css['colors-grid']}>
            {colorsTemp}
          </div>

          <RibbonItem icon={colors32} hasArrow={false} name="Edit colors"/>
        </div>

    </RibbonItemExpanded>
  );
}

export default RibbonColors;