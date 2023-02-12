import React from 'react';
import css from './RibbonDisplay.module.css';

import RibbonItemExpanded from '../RibbonItemExpanded/RibbonItemExpanded';
import BigButton from '../BigButton/BigButton';

import full32 from './assets/full-32.png';
import thumb32 from './assets/thumb-32.png';

function RibbonDisplay() {
  return (
    <RibbonItemExpanded name="Display">
      <div className={css['container']}>
        <BigButton icon={full32} hasArrow={false} name={<div>Full <div className="line-break"></div> screen</div>}/>
        <BigButton icon={thumb32} hasArrow={false} name="Thumbnail"/>
      </div>
    </RibbonItemExpanded>
  );
}

export default RibbonDisplay;