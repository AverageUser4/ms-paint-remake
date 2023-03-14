import React, { memo } from 'react';
import css from './RibbonDisplay.module.css';

import RibbonItemExpanded from '../RibbonItemExpanded/RibbonItemExpanded';
import BigButton from '../BigButton/BigButton';
import Tooltip from '../Tooltip/Tooltip';

import { useCanvasContext } from '../../context/CanvasContext';

import full32 from './assets/full-32.png';
import thumb32 from './assets/thumb-32.png';

const RibbonDisplay = memo(function RibbonDisplay() {
  const { setIsFullScreenView } = useCanvasContext();
  
  return (
    <RibbonItemExpanded name="Display">
      <div className={css['container']}>
        <BigButton 
          icon={full32}
          hasArrow={false}
          name={<div>Full <div className="line-break"></div> screen</div>}
          strName="Full-screen"
          onClick={() => {
            setIsFullScreenView(true);
          }}
          describedBy="id-display-full-screen"
          tooltip={
            <Tooltip
              ID="id-display-full-screen"
              heading="Full screen (F11)"
              text="View the picture in full screen."
            />
          }
        />
        <BigButton 
          icon={thumb32}
          hasArrow={false}
          name="Thumbnail"
          strName="Thumbnail"
          isDisabled={true}
          describedBy="id-display-thumbnail"
          tooltip={
            <Tooltip
              ID="id-display-thumbnail"
              heading="Thumbnail"
              text="Show or hide the Thumbnail window."
            />
          }
        />
      </div>
    </RibbonItemExpanded>
  );
});

export default RibbonDisplay;