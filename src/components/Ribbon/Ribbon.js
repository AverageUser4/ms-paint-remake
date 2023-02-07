import React from "react";
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

function Ribbon({ windowWidth, activeRibbonTab, hideRibbon }) {
  let ribbonClasses = css['ribbon'];
  if(hideRibbon)
    ribbonClasses += ` ${css['ribbon--hidden']}`;
  
  if(activeRibbonTab === 'home') {
    return (
      <div className={css['container']}>
        <div className={ribbonClasses}>
          <RibbonClipboard ribbonWidth={windowWidth}/>
          <RibbonImage ribbonWidth={windowWidth}/>
          <RibbonTools ribbonWidth={windowWidth}/>
          <RibbonBrushes/>
          <RibbonShapes ribbonWidth={windowWidth}/>
          <RibbonSize/>
          <RibbonColors ribbonWidth={windowWidth}/>
        </div>
      </div>
    );
  } else {
    return (
      <div className={css['container']}>
        <div className={ribbonClasses}>
          <RibbonZoom ribbonWidth={windowWidth}/>
          <RibbonShowOrHide/>
          <RibbonDisplay/>
        </div>
      </div>
    );
  }
}

Ribbon.propTypes = {
  windowWidth: PropTypes.number,
  activeRibbonTab: PropTypes.oneOf(['home', 'view']),
  hideRibbon: PropTypes.bool
};

export default Ribbon;