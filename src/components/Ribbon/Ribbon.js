import React from "react";
import css from './Ribbon.module.css';
import RibbonItem from '../RibbonItem/RibbonItem';
import clipboard from '../../assets/Ribbon/clipboard.png';
import image from '../../assets/Ribbon/image.png';
import tools from '../../assets/Ribbon/tools.png';
import shapes from '../../assets/Ribbon/shapes.png';
import colors from '../../assets/Ribbon/colors.png';

function Ribbon() {
  return (
    <div className={css['container']}>
      <RibbonItem icon={clipboard} name="Clipboard"/>
      <RibbonItem icon={image} name="Image"/>
      <RibbonItem icon={tools} name="Tools"/>
      <RibbonItem icon={shapes} name="Shapes"/>
      <RibbonItem icon={colors} name="Colors"/>
    </div>
  );
}

export default Ribbon;