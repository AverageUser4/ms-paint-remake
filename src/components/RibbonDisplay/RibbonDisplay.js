import React from 'react';
import css from './RibbonDisplay.module.css';

import RibbonItemExpanded from '../RibbonItemExpanded/RibbonItemExpanded';
import BigButton from '../BigButton/BigButton';

import { useCanvasContext } from '../../misc/CanvasContext';

import full32 from './assets/full-32.png';
import thumb32 from './assets/thumb-32.png';

function RibbonDisplay() {
  const { setIsFullScreenView } = useCanvasContext();
  
  return (
    <RibbonItemExpanded name="Display">
      <div className={css['container']}>
        <BigButton 
          icon={full32}
          hasArrow={false}
          name={<div>Full <div className="line-break"></div> screen</div>}
          strName="Full-screen"
          onPointerDown={() => {
            setIsFullScreenView(true);
          }}
        />
        <BigButton 
          icon={thumb32}
          hasArrow={false}
          name="Thumbnail"
          strName="Thumbnail"
          isDisabled={true}
        />
      </div>
    </RibbonItemExpanded>
  );
}

export default RibbonDisplay;