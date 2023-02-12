import React, { useState, useRef } from "react";
import PropTypes from 'prop-types';
import css from './ShapesGrid.module.css';

import useOutsideClick from "../../hooks/useOutsideClick";
import { toggleBoolState } from "../../utils/utils";

import callout16 from './assets/callout-16.png';
import cloudCallout16 from './assets/cloud-callout-16.png';
import curve16 from './assets/curve-16.png';
import diamond16 from './assets/diamond-16.png';
import downArrow16 from './assets/down-arrow-16.png';
import fivePointStar16 from './assets/five-point-star-16.png';
import fourPointStar16 from './assets/four-point-star-16.png';
import heart16 from './assets/heart-16.png';
import hexagon16 from './assets/hexagon-16.png';
import leftArrow16 from './assets/left-arrow-16.png';
import lightning16 from './assets/lightning-16.png';
import line16 from './assets/line-16.png';
import oval16 from './assets/oval-16.png';
import ovalCallout16 from './assets/oval-callout-16.png';
import pentagon16 from './assets/pentagon-16.png';
import polygon16 from './assets/polygon-16.png';
import rectangle16 from './assets/rectangle-16.png';
import rightArrow16 from './assets/right-arrow-16.png';
import rightTriangle16 from './assets/right-triangle-16.png';
import roundedRectangle16 from './assets/rounded-rectangle-16.png';
import sixPointStar16 from './assets/six-point-star-16.png';
import triangle16 from './assets/triangle-16.png';
import upArrow16 from './assets/up-arrow-16.png';
import { ReactComponent as TriangleDown } from '../../assets/global/triangle-down.svg';
import { ReactComponent as TriangleLine } from '../../assets/global/triangle-line.svg';

function ShapesGrid() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);
  const dropdownRef = useRef();
  useOutsideClick(dropdownRef, () => isDropdownOpen && setIsDropdownOpen(false));
  
  return (
    <div className={css['container']}>
      <div className={css['grid']}>
        <Shapes/>
      </div>

      <div>
        <button className={`${css['button']} ${css['button--disabled']}`}>
          <TriangleDown className="rotate-180"/>
        </button>
        <button className={css['button']}>
          <TriangleDown/>
        </button>
        <button 
          className={css['button']}
          onPointerDown={() => toggleBoolState(isDropdownOpen, setIsDropdownOpen)}
        >
          <TriangleLine/>
        </button>
      </div>

      {
        isDropdownOpen &&
          <div className={`${css['dropdown']} popup`} ref={dropdownRef}>
            <div className={css['expanded']}>
              <div className={css['expanded__grid']}>
                <Shapes/>
              </div>

              <div className={css['expanded__scrollbar']}>
                <button className={`${css['expanded__scrollbar__button']} ${css['expanded__scrollbar__button--disabled']}`}>
                  <TriangleDown className="rotate-180"/>
                </button>
                <button className={`${css['expanded__scrollbar__button']} ${css['expanded__scrollbar__button--disabled']}`}>
                  <TriangleDown/>
                </button>
              </div>
            </div>
          </div>
      }
    </div>
  );
}

function Shapes() {
  return (
    <>
      <button className="button">
        <img src={line16} alt=""/>
      </button>

      <button className="button">
        <img src={curve16} alt=""/>
      </button>

      <button className="button">
        <img src={oval16} alt=""/>
      </button>

      <button className="button">
        <img src={rectangle16} alt=""/>
      </button>

      <button className="button">
        <img src={roundedRectangle16} alt=""/>
      </button>

      <button className="button">
        <img src={polygon16} alt=""/>
      </button>

      <button className="button">
        <img src={triangle16} alt=""/>
      </button>

      <button className="button">
        <img src={rightTriangle16} alt=""/>
      </button>

      <button className="button">
        <img src={diamond16} alt=""/>
      </button>

      <button className="button">
        <img src={pentagon16} alt=""/>
      </button>

      <button className="button">
        <img src={hexagon16} alt=""/>
      </button>

      <button className="button">
        <img src={rightArrow16} alt=""/>
      </button>

      <button className="button">
        <img src={leftArrow16} alt=""/>
      </button>

      <button className="button">
        <img src={upArrow16} alt=""/>
      </button>

      <button className="button">
        <img src={downArrow16} alt=""/>
      </button>

      <button className="button">
        <img src={fourPointStar16} alt=""/>
      </button>

      <button className="button">
        <img src={fivePointStar16} alt=""/>
      </button>

      <button className="button">
        <img src={sixPointStar16} alt=""/>
      </button>

      <button className="button">
        <img src={callout16} alt=""/>
      </button>

      <button className="button">
        <img src={ovalCallout16} alt=""/>
      </button>

      <button className="button">
        <img src={cloudCallout16} alt=""/>
      </button>

      <button className="button">
        <img src={heart16} alt=""/>
      </button>

      <button className="button">
        <img src={lightning16} alt=""/>
      </button>
    </>
  );
}

export default ShapesGrid;