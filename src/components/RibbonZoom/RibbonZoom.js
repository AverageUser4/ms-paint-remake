import React, { memo } from 'react';
import PropTypes from 'prop-types';
import css from './RibbonZoom.module.css';

import BigButton from '../BigButton/BigButton';
import RibbonItemExpanded from '../RibbonItemExpanded/RibbonItemExpanded';
import Tooltip from '../Tooltip/Tooltip';

import { useCanvasContext } from '../../context/CanvasContext';
import { useActionsContext } from '../../context/ActionsContext';

import zoomIn16 from './assets/zoom-in-16.png';
import zoomIn32 from './assets/zoom-in-32.png';
import zoomOut16 from './assets/zoom-out-16.png';
import zoomOut32 from './assets/zoom-out-32.png';
import percent16 from './assets/100-percent-16.png';
import percent32 from './assets/100-percent-32.png';

const RibbonZoom = memo(function RibbonZoom({ ribbonWidth }) {
  const { doSetCanvasZoom } = useCanvasContext();
  const { doCanvasChangeZoom } = useActionsContext();
  
  const zoomInTooltip = (
    <Tooltip
      ID="id-zoom-zoom-in"
      heading="Zoom in (Ctrl+PgUp)"
      text="Zoom in on the current picture."
    />
  );
  const zoomOutTooltip = (
    <Tooltip
      ID="id-zoom-zoom-out"
      heading="Zoom out (Ctrl+PgDn)"
      text="Zoom out on the current picture."
    />
  );
  const zoom100Tooltip = (
    <Tooltip
      ID="id-zoom-zoom-100"
      heading="100%"
      text="Zoom to 100%."
    />
  );

  if(ribbonWidth < 350) {
    return (
      <RibbonItemExpanded name="Zoom">
        <button 
          className="tooltip-container button"
          onClick={() => doCanvasChangeZoom(false)}
          aria-describedby="id-zoom-zoom-in"
        >
          <img src={zoomIn16} alt=""/>
          <span className="text text--1">Zoom in</span>
          {zoomInTooltip}
        </button>

        <button 
          className="tooltip-container button"
          onClick={() => doCanvasChangeZoom(true)}
          aria-describedby="id-zoom-zoom-out"
        >
          <img src={zoomOut16} alt=""/>
          <span className="text text--1">Zoom out</span>
          {zoomOutTooltip}
        </button>

        <button 
          className="tooltip-container button"
          onClick={() => doSetCanvasZoom(1)}
          aria-describedby="id-zoom-zoom-100"
        >
          <img src={percent16} alt=""/>
          <span className="text text--1">100%</span>
          {zoom100Tooltip}
        </button>
      </RibbonItemExpanded>
    );
  }

  return (
    <RibbonItemExpanded name="Zoom">
      <div className={css['container']}>
        <BigButton 
          iconSrc={zoomIn32}
          name={<div>Zoom <div className="line-break"></div> in</div>}
          strName="Zoom-in"
          onClick={() => doCanvasChangeZoom(false)}
          ariaDescribedBy="id-zoom-zoom-in"
          tooltipElement={zoomInTooltip}
        />
        <BigButton 
          iconSrc={zoomOut32}
          name={<div>Zoom <div className="line-break"></div> out</div>}
          strName="Zoom-out"
          onClick={() => doCanvasChangeZoom(true)}
          ariaDescribedBy="id-zoom-zoom-out"
          tooltipElement={zoomOutTooltip}
        />
        <BigButton 
          iconSrc={percent32}
          name={<div>100 <div className="line-break"></div> %</div>}
          strName="100%"
          onClick={() => doSetCanvasZoom(1)}
          ariaDescribedBy="id-zoom-zoom-100"
          tooltipElement={zoom100Tooltip}
        />
      </div>
    </RibbonItemExpanded>
  );
});

RibbonZoom.propTypes = {
  ribbonWidth: PropTypes.number.isRequired,
};

export default RibbonZoom;