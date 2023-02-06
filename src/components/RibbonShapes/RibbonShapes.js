import React from "react";
import PropTypes from 'prop-types';
import css from './RibbonShapes.module.css';

import RibbonItem from '../RibbonItem/RibbonItem';
import RibbonItemExpanded from "../RibbonItemExpanded/RibbonItemExpanded";
import RibbonItemContainer from "../RibbonItemContainer/RibbonItemContainer";

import shapes16 from './assets/shapes-16.png';
import shapes32 from './assets/shapes-32.png';
import fill16 from './assets/fill-16.png';
import outline16 from './assets/outline-16.png';
import { ReactComponent as TriangleDown } from '../../assets/global/triangle-down.svg';

function RibbonShapes({ ribbonWidth }) {
  const showContent = ribbonWidth >= 800;
  const showText = ribbonWidth < 800 || ribbonWidth >= 900;

  return (
    <RibbonItemContainer showContent={showContent} icon={shapes16} name="Shapes">
      <RibbonItemExpanded name="Shapes">

          <div className={css['container']}>
            <RibbonItem icon={shapes32} name="Shapes"/>

            <div>
              <button className="button">
                <img draggable="false" src={outline16} alt="Outline."/>
                {showText && <span className="text text--1">Outline</span>}
                <TriangleDown/>
              </button>

              <button className="button">
                <img draggable="false" src={fill16} alt="Fill."/>
                {showText && <span className="text text--1">Fill</span>}
                <TriangleDown/>
              </button>
            </div>
          </div>

      </RibbonItemExpanded>
    </RibbonItemContainer>
  );
}

RibbonShapes.propTypes = {
  ribbonWidth: PropTypes.number
};

export default RibbonShapes;