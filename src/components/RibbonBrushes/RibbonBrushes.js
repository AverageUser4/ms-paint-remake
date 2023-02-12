import React from "react";
import css from './RibbonBrushes.module.css';

import BigButtonDuo from "../BigButtonDuo/BigButtonDuo";

import brushes32 from './assets/brushes-32.png';

function RibbonBrushes() {
  return (
    <BigButtonDuo icon={brushes32} name="Brushes">
      
    </BigButtonDuo>
  );
}

export default RibbonBrushes;