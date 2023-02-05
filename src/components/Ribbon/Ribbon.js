import React, { useRef, useState, useEffect } from "react";
import css from './Ribbon.module.css';

import RibbonClipboard from "../RibbonClipboard/RibbonClipboard";
import RibbonImage from "../RibbonImage/RibbonImage";
import RibbonTools from "../RibbonTools/RibbonTools";
import RibbonShapes from "../RibbonShapes/RibbonShapes";
import RibbonColors from "../RibbonColors/RibbonColors";
import RibbonSize from "../RibbonSize/RibbonSize";
import RibbonBrushes from "../RibbonBrushes/RibbonBrushes";

function Ribbon({ windowWidth }) {
  const containerRef = useRef();
  
  return (
    <div ref={containerRef} className={css['container']}>
      <RibbonClipboard ribbonWidth={windowWidth}/>
      <RibbonImage ribbonWidth={windowWidth}/>
      <RibbonTools ribbonWidth={windowWidth}/>
      <RibbonBrushes/>
      <RibbonShapes ribbonWidth={windowWidth}/>
      <RibbonSize/>
      <RibbonColors ribbonWidth={windowWidth}/>
    </div>
  );
}

export default Ribbon;