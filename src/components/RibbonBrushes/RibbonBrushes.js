import React from "react";
import css from './RibbonBrushes.module.css';

import RibbonItemDuo from "../RibbonItemDuo/RibbonItemDuo";

import brushes32 from './assets/brushes-32.png';

function RibbonBrushes() {
  return (
    <RibbonItemDuo icon={brushes32} name="Brushes">
      
    </RibbonItemDuo>
  );
}

export default RibbonBrushes;