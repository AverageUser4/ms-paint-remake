import React from "react";
import PropTypes from 'prop-types';
import css from './RibbonImage.module.css';

import BigButtonDuo from '../BigButtonDuo/BigButtonDuo';
import RibbonItemExpanded from "../RibbonItemExpanded/RibbonItemExpanded";
import RibbonItemContainer from '../RibbonItemContainer/RibbonItemContainer';

import image16 from './assets/image-16.png';
import image32 from './assets/image-32.png';
import crop16 from './assets/crop-16.png';
import resize16 from './assets/resize-16.png';
import rotate16 from './assets/rotate-16.png';
import { ReactComponent as TriangleDown } from '../../assets/global/triangle-down.svg';

function RibbonImage({ ribbonWidth }) {
  const isOnlyContent = ribbonWidth >= 840;
  const showText = ribbonWidth < 840 || ribbonWidth >= 1000;
  
  return (
    <RibbonItemContainer isOnlyContent={isOnlyContent} icon={image16} name="Image">
      <RibbonItemExpanded name="Image">

          <div className={css['container']}>
            <BigButtonDuo icon={image32} name="Select"/>

            <div>
              <button className="button">
                <img draggable="false" src={crop16} alt="Crop."/>
                {showText && <span className="text text--1">Crop</span>}
              </button>

              <button className="button">
                <img draggable="false" src={resize16} alt="Resize."/>
                {showText && <span className="text text--1">Resize</span>}
              </button>

              <button className="button">
                <img draggable="false" src={rotate16} alt="Rotate."/>
                {showText && <span className="text text--1">Rotate</span>}
                <TriangleDown/>
              </button>
            </div>
          </div>

      </RibbonItemExpanded>
    </RibbonItemContainer>
  );
}

RibbonImage.propTypes = {
  ribbonWidth: PropTypes.number.isRequired,
};

export default RibbonImage;