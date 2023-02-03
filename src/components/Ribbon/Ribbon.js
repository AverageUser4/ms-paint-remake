import React from "react";
import css from './Ribbon.module.css';

import RibbonClipboard from "../RibbonClipboard/RibbonClipboard";
import RibbonImage from "../RibbonImage/RibbonImage";
import RibbonTools from "../RibbonTools/RibbonTools";
import RibbonShapes from "../RibbonShapes/RibbonShapes";
import RibbonColors from "../RibbonColors/RibbonColors";
import RibbonSize from "../RibbonSize/RibbonSize";
import RibbonBrushes from "../RibbonBrushes/RibbonBrushes";

function Ribbon() {
  return (
    <div className={css['container']}>
      <RibbonClipboard/>
      <RibbonImage/>
      <RibbonTools/>
      <RibbonBrushes/>
      <RibbonShapes/>
      <RibbonSize/>
      <RibbonColors/>
    </div>
  );
}

export default Ribbon;