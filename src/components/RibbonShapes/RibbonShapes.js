import React from "react";
import css from './RibbonShapes.module.css';

import RibbonItem from '../RibbonItem/RibbonItem';
import RibbonItemExpanded from "../RibbonItemExpanded/RibbonItemExpanded";
import RibbonItemContainer from "../RibbonItemContainer/RibbonItemContainer";

import shapes16 from './assets/shapes-16.png';
import shapes32 from './assets/shapes-32.png';
import fill16 from './assets/fill-16.png';
import outline16 from './assets/outline-16.png';

function RibbonShapes() {
  return (
    <RibbonItemContainer icon={shapes16} name="Shapes">
      <RibbonItemExpanded name="Shapes">

          <div className={css['container']}>
            <RibbonItem icon={shapes32} name="Shapes"/>

            <div>
              <button className="button">
                <img draggable="false" src={outline16} alt="Outline."/>
              </button>

              <button className="button">
                <img draggable="false" src={fill16} alt="Fill."/>
              </button>
            </div>
          </div>

      </RibbonItemExpanded>
    </RibbonItemContainer>
  );
}

export default RibbonShapes;