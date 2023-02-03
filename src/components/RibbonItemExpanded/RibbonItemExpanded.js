import React from "react";
import css from './RibbonItemExpanded.module.css';
import RibbonItemDuo from '../RibbonItemDuo/RibbonItemDuo';
import clipboard32 from '../../assets/RibbonClipboard/clipboard-32.png';
import copy16 from '../../assets/RibbonClipboard/copy-16.png';
import cut16 from '../../assets/RibbonClipboard/cut-16.png';

function RibbonItemExpanded({ name, children }) {
  return (
    <div className={css['container']}>

      <div>
        {children}
      </div>

      <h3 className="text text--2">{name}</h3>

    </div>
  );
}

export default RibbonItemExpanded;