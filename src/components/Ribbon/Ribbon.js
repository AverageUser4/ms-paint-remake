import React, { memo, useRef } from "react";
import PropTypes from 'prop-types';
import css from './Ribbon.module.css';

import RibbonClipboard from "../RibbonClipboard/RibbonClipboard";
import RibbonImage from "../RibbonImage/RibbonImage";
import RibbonTools from "../RibbonTools/RibbonTools";
import RibbonShapes from "../RibbonShapes/RibbonShapes";
import RibbonColors from "../RibbonColors/RibbonColors";
import RibbonSize from "../RibbonSize/RibbonSize";
import RibbonBrushes from "../RibbonBrushes/RibbonBrushes";
import RibbonZoom from "../RibbonZoom/RibbonZoom";
import RibbonShowOrHide from "../RibbonShowOrHide/RibbonShowOrHide";
import RibbonDisplay from "../RibbonDisplay/RibbonDisplay";
import useOutsideClick from "../../hooks/useOutsideClick";

const Ribbon = memo(function Ribbon({ windowWidth, ribbonData }) {
  const containerRef = useRef();
  useOutsideClick({
    containerRef,
    callback: () => ribbonData.minimize && ribbonData.expand && ribbonData.stopExpanding(),
    dataControl: 'ribbon',
    isInvokeOnEscapeKey: true,
  });
  
  let ribbonClasses = css['ribbon'];
  if(ribbonData.minimize)
    ribbonClasses += ` ${css['ribbon--minimized']}`;

  if(ribbonData.minimize && !ribbonData.expand)
    return null;
    
  return (
    <div 
      className={css['container']}
      ref={containerRef}
    >
      <div 
        id="ribbon" 
        className={ribbonClasses}
        data-cy="Ribbon"
      >
        {
          ribbonData.activeTab === 'home' ?
            <>
              <RibbonClipboard 
                ribbonWidth={windowWidth}
              />

              <RibbonImage
                ribbonWidth={windowWidth}
              />

              <RibbonTools 
                ribbonWidth={windowWidth}
              />

              <RibbonBrushes/>

              <div className="vertical-line"></div>

              <RibbonShapes 
                ribbonWidth={windowWidth}
              />

              <RibbonSize/>

              <div className="vertical-line"></div>

              <RibbonColors 
                ribbonWidth={windowWidth}
              />

              <div className="vertical-line"></div>
            </>
          :
            <>
              <RibbonZoom 
                ribbonWidth={windowWidth}
              />

              <RibbonShowOrHide/>

              <RibbonDisplay/>
            </>
        }
      </div>
    </div>
  );
});

Ribbon.propTypes = {
  windowWidth: PropTypes.number.isRequired,
  ribbonData: PropTypes.object.isRequired,
};

export default Ribbon;