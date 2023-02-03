import React from "react";
import css from './RibbonShapes.module.css';

import RibbonItem from '../RibbonItem/RibbonItem';
import RibbonItemExpanded from "../RibbonItemExpanded/RibbonItemExpanded";

import shapes32 from '../../assets/RibbonShapes/shapes-32.png';
import fill16 from '../../assets/RibbonShapes/fill-16.png';
import outline16 from '../../assets/RibbonShapes/outline-16.png';

function RibbonShapes() {
  return (
    <RibbonItemExpanded name="Shapes">

        <div className={css['container']}>
          <RibbonItem icon={shapes32} name="Shapes"/>

          <div>
            <button className="button">
              <img src={outline16} alt="Outline."/>
            </button>

            <button className="button">
              <img src={fill16} alt="Fill."/>
            </button>
          </div>
        </div>

    </RibbonItemExpanded>
  );
}

export default RibbonShapes;