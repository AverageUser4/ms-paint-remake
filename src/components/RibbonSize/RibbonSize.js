import React from "react";
import css from './RibbonSize.module.css';

import RibbonItem from "../RibbonItem/RibbonItem";

import size32 from './assets/size-32.png';

function RibbonSize() {
  return (
    <RibbonItem icon={size32} name="Size">

    </RibbonItem>
  );
}

export default RibbonSize;