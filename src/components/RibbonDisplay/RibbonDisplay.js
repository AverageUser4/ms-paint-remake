import React, { memo } from 'react';
import css from './RibbonDisplay.module.css';

import RibbonItemExpanded from '../RibbonItemExpanded/RibbonItemExpanded';
import BigButton from '../BigButton/BigButton';
import Tooltip from '../Tooltip/Tooltip';

import { useCanvasContext } from '../../context/CanvasContext';
import { useWindowsContext } from '../../context/WindowsContext';

import full32 from './assets/full-32.png';
import thumb32 from './assets/thumb-32.png';

const RibbonDisplay = memo(function RibbonDisplay() {
  const { setIsFullScreenView } = useCanvasContext();
  const { setIsThumbnailWindowOpen } = useWindowsContext();
  
  return (
    <RibbonItemExpanded name="Display">
      <div className={css['container']}>
        <BigButton 
          iconSrc={full32}
          name={<div>Full <div className="line-break"></div> screen</div>}
          strName="Full-screen"
          onClick={() => {
            setIsFullScreenView(true);
          }}
          ariaDescribedBy="id-display-full-screen"
          tooltipElement={
            <Tooltip
              ID="id-display-full-screen"
              heading="Full screen (F11)"
              text="View the picture in full screen."
            />
          }
        />
        <BigButton 
          iconSrc={thumb32}
          name="Thumbnail"
          strName="Thumbnail"
          onClick={() => setIsThumbnailWindowOpen(true)}
          ariaDescribedBy="id-display-thumbnail"
          tooltipElement={
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