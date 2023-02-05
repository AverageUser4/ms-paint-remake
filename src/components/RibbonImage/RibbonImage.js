import React from "react";
import css from './RibbonImage.module.css';

import RibbonItemDuo from '../RibbonItemDuo/RibbonItemDuo';
import RibbonItemExpanded from "../RibbonItemExpanded/RibbonItemExpanded";
import RibbonItemContainer from '../RibbonItemContainer/RibbonItemContainer';

import image16 from './assets/image-16.png';
import image32 from './assets/image-32.png';
import crop16 from './assets/crop-16.png';
import resize16 from './assets/resize-16.png';
import rotate16 from './assets/rotate-16.png';

function RibbonImage({ ribbonWidth}) {
  const showContent = ribbonWidth >= 840;
  
  return (
    <RibbonItemContainer showContent={showContent} icon={image16} name="Image">
      <RibbonItemExpanded name="Image">

          <div className={css['container']}>
            <RibbonItemDuo icon={image32} name="Select"/>

            <div>
              <button className="button">
                <img draggable="false" src={crop16} alt="Crop."/>
              </button>

              <button className="button">
                <img draggable="false" src={resize16} alt="Resize."/>
              </button>

              <button className="button">
                <img draggable="false" src={rotate16} alt="Rotate."/>
              </button>
            </div>
          </div>

      </RibbonItemExpanded>
    </RibbonItemContainer>
  );
}

export default RibbonImage;