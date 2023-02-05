import React from "react";
import css from './Ribbon.module.css';

import RibbonClipboard from "../RibbonClipboard/RibbonClipboard";
import RibbonImage from "../RibbonImage/RibbonImage";
import RibbonTools from "../RibbonTools/RibbonTools";
import RibbonShapes from "../RibbonShapes/RibbonShapes";
import RibbonColors from "../RibbonColors/RibbonColors";
import RibbonSize from "../RibbonSize/RibbonSize";
import RibbonBrushes from "../RibbonBrushes/RibbonBrushes";

function Ribbon({ windowWidth, activeRibbonTab }) {
  console.log(activeRibbonTab)
  
  if(activeRibbonTab === 'home') {
    return (
      <div className={css['container']}>
        <RibbonClipboard ribbonWidth={windowWidth}/>
        <RibbonImage ribbonWidth={windowWidth}/>
        <RibbonTools ribbonWidth={windowWidth}/>
        <RibbonBrushes/>
        <RibbonShapes ribbonWidth={windowWidth}/>
        <RibbonSize/>
        <RibbonColors ribbonWidth={windowWidth}/>
      </div>
    );
  } else {
    return (
      <div className={css['container']}>
      </div>
    );
  }
}

export default Ribbon;