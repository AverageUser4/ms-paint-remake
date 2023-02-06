import React from 'react';
import PropTypes from 'prop-types';
import css from './RibbonZoom.module.css';

import RibbonItem from '../RibbonItem/RibbonItem';
import RibbonItemExpanded from '../RibbonItemExpanded/RibbonItemExpanded';

import zoomIn16 from './assets/zoom-in-16.png';
import zoomIn32 from './assets/zoom-in-32.png';
import zoomOut16 from './assets/zoom-out-16.png';
import zoomOut32 from './assets/zoom-out-32.png';
import percent16 from './assets/100-percent-16.png';
import percent32 from './assets/100-percent-32.png';

function RibbonZoom({ ribbonWidth }) {
  if(ribbonWidth < 350) {
    return (
      <RibbonItemExpanded name="Zoom">
        <button className="button">
          <img src={zoomIn16} alt=""/>
          <span className="text text--1">Zoom in</span>
        </button>

        <button className="button">
          <img src={zoomOut16} alt=""/>
          <span className="text text--1">Zoom out</span>
        </button>

        <button className="button">
          <img src={percent16} alt=""/>
          <span className="text text--1">100%</span>
        </button>
      </RibbonItemExpanded>
    );
  }

  return (
    <RibbonItemExpanded name="Zoom">
      <div className={css['container']}>
        <RibbonItem icon={zoomIn32} hasArrow={false} name={<div>Zoom <div className="line-break"></div> in</div>}/>
        <RibbonItem icon={zoomOut32} hasArrow={false} name={<div>Zoom <div className="line-break"></div> out</div>}/>
        <RibbonItem icon={percent32} hasArrow={false} name={<div>100 <div className="line-break"></div> %</div>}/>
      </div>
    </RibbonItemExpanded>
  );
}

RibbonZoom.propTypes = {
  ribbonWidth: PropTypes.number
};

export default RibbonZoom;