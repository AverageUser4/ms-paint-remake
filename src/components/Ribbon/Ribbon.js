import React from "react";
import css from './Ribbon.module.css';

import RibbonItemContainer from '../RibbonItemContainer/RibbonItemContainer';
import RibbonItemDuo from '../RibbonItemDuo/RibbonItemDuo';
import RibbonItem from "../RibbonItem/RibbonItem";
import RibbonClipboard from "../RibbonClipboard/RibbonClipboard";
import RibbonImage from "../RibbonImage/RibbonImage";
import RibbonTools from "../RibbonTools/RibbonTools";
import RibbonShapes from "../RibbonShapes/RibbonShapes";
import RibbonColors from "../RibbonColors/RibbonColors";

import clipboard from '../../assets/RibbonClipboard/clipboard-16.png';
import image from '../../assets/RibbonImage/image-16.png';
import tools from '../../assets/RibbonTools/tools-16.png';
import shapes from '../../assets/RibbonShapes/shapes-16.png';
import colors from '../../assets/RibbonColors/colors-16.png';
import brushes from '../../assets/RibbonBrushes/brushes-32.png';
import size from '../../assets/RibbonSize/size-32.png';

function Ribbon() {
  return (
    <div className={css['container']}>

      <RibbonItemContainer icon={clipboard} name="Clipboard">
        <RibbonClipboard/>
      </RibbonItemContainer>

      <RibbonItemContainer icon={image} name="Image">
        <RibbonImage/>
      </RibbonItemContainer>

      <RibbonItemContainer icon={tools} name="Tools">
        <RibbonTools/>
      </RibbonItemContainer>

      <RibbonItemDuo icon={brushes} name="Brushes"/>

      <RibbonItemContainer icon={shapes} name="Shapes">
        <RibbonShapes/>
      </RibbonItemContainer>

      <RibbonItem icon={size} name="Size"/>

      <RibbonItemContainer icon={colors} name="Colors">
        <RibbonColors/>
      </RibbonItemContainer>

    </div>
  );
}

export default Ribbon;