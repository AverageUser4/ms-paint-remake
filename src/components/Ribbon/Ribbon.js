import React, { useEffect, useRef } from "react";
import PropTypes from 'prop-types';
import css from './Ribbon.module.css';

import RibbonClipboard from "../RibbonClipboard/RibbonClipboard";
import RibbonImage from "../RibbonImage/RibbonImage";
import RibbonTools from "../RibbonTools/RibbonTools";
import RibbonShapes from "../RibbonShapes/RibbonShapes";
import RibbonColors from "../RibbonColors/RibbonColors";
import RibbonSize from "../RibbonSize/RibbonSize";
import RibbonBrushes from "../RibbonBrushes/RibbonBrushes";
import RibbonZoom from "../RibbonZoom/RibbonZoom";
import RibbonShowOrHide from "../RibbonShowOrHide/RibbonShowOrHide";
import RibbonDisplay from "../RibbonDisplay/RibbonDisplay";

function Ribbon({ windowWidth, ribbonData, setRibbonData }) {
  const containerRef = useRef();
  
  useEffect(() => {
    function onPointerDown(event) {
      if(
          !containerRef.current ||
          containerRef.current === event.target ||
          containerRef.current.contains(event.target) ||
          event.target.ariaControls === 'ribbon'
        )
        return;

      if(ribbonData.minimize && ribbonData.expand)
        setRibbonData(prev => ({ ...prev, expand: false }));
    }

    window.addEventListener('pointerdown', onPointerDown);

    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, [ribbonData]);
  
  let ribbonClasses = css['ribbon'];
  if(ribbonData.minimize)
    ribbonClasses += ` ${css['ribbon--minimized']}`;
  if(ribbonData.expand)
    ribbonClasses += ` ${css['ribbon--expanded']}`;
  
  return (
    <div className={css['container']} ref={containerRef}>
      <div id="ribbon" className={ribbonClasses}>
        {
          ribbonData.activeTab === 'home' ?
            <>
              <RibbonClipboard ribbonWidth={windowWidth}/>
              <RibbonImage ribbonWidth={windowWidth}/>
              <RibbonTools ribbonWidth={windowWidth}/>
              <RibbonBrushes/>
              <RibbonShapes ribbonWidth={windowWidth}/>
              <RibbonSize/>
              <RibbonColors ribbonWidth={windowWidth}/>
            </>
          :
            <>
              <RibbonZoom ribbonWidth={windowWidth}/>
              <RibbonShowOrHide/>
              <RibbonDisplay/>
            </>
        }
      </div>
    </div>
  );
}

Ribbon.propTypes = {
  windowWidth: PropTypes.number.isRequired,
  ribbonData: PropTypes.object.isRequired,
  setRibbonData: PropTypes.func.isRequired
};

export default Ribbon;