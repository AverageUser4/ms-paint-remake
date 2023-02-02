import React from "react";
import css from './Ribbon.module.css';
import RibbonItem from '../RibbonItem/RibbonItem';
import RibbonItemDuo from '../RibbonItemDuo/RibbonItemDuo';
import clipboard from '../../assets/Ribbon/clipboard.png';
import clipboard32 from '../../assets/Ribbon/clipboard-32.png';
import image from '../../assets/Ribbon/image.png';
import tools from '../../assets/Ribbon/tools.png';
import shapes from '../../assets/Ribbon/shapes.png';
import colors from '../../assets/Ribbon/colors.png';
import brush from '../../assets/Ribbon/brush.png';
import RibbonSize from "../RibbonSize/RibbonSize";
import RibbonClipboard from "../RibbonClipboard/RibbonClipboard";


function Ribbon() {
  return (
    <div className={css['container']}>

      <RibbonItem icon={clipboard} name="Clipboard">
        {/* <RibbonClipboard/> */}
      </RibbonItem>

      <RibbonItemDuo icon={clipboard32} name="Paste"/>

      <RibbonItem icon={image} name="Image"/>
      <RibbonItem icon={tools} name="Tools"/>
      <RibbonItemDuo icon={brush} name="Brushes"/>
      <RibbonItem icon={shapes} name="Shapes"/>
      <RibbonSize/>
      <RibbonItem icon={colors} name="Colors"/>

    </div>
  );
}

export default Ribbon;