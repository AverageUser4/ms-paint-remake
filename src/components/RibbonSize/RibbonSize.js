import React, { useState } from "react";
import css from './RibbonSize.module.css';

import BigButton from "../BigButton/BigButton";

import size32 from './assets/size-32.png';

function RibbonSize() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  return (
    <BigButton 
      icon={size32}
      name="Size"
      showChildren={isDropdownOpen}
    >
      <div>
        
      </div>
    </BigButton>
  );
}

export default RibbonSize;