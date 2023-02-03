import React from "react";
import css from './RibbonImage.module.css';

import RibbonItemDuo from '../RibbonItemDuo/RibbonItemDuo';
import RibbonItemExpanded from "../RibbonItemExpanded/RibbonItemExpanded";

import image32 from '../../assets/RibbonImage/image-32.png';
import crop16 from '../../assets/RibbonImage/crop-16.png';
import resize16 from '../../assets/RibbonImage/resize-16.png';
import rotate16 from '../../assets/RibbonImage/rotate-16.png';

function RibbonImage() {
  return (
    <RibbonItemExpanded name="Image">

        <div className={css['container']}>
          <RibbonItemDuo icon={image32} name="Select"/>

          <div>
            <button className="button">
              <img src={crop16} alt="Crop."/>
            </button>

            <button className="button">
              <img src={resize16} alt="Resize."/>
            </button>

            <button className="button">
              <img src={rotate16} alt="Rotate."/>
            </button>
          </div>
        </div>

    </RibbonItemExpanded>
  );
}

export default RibbonImage;