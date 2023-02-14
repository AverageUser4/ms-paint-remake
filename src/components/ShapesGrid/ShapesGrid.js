import React, { useState, useRef, useEffect } from "react";
import PropTypes from 'prop-types';
import css from './ShapesGrid.module.css';

import Dropdown from '../Dropdown/Dropdown';

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

const shapesData = [
  { src: line16 },
  { src: curve16 },
  { src: oval16 },
  { src: rectangle16 },
  { src: roundedRectangle16 },
  { src: polygon16 },
  { src: triangle16 },
  { src: rightTriangle16 },
  { src: diamond16 },
  { src: pentagon16 },
  { src: hexagon16 },
  { src: rightArrow16 },
  { src: leftArrow16 },
  { src: upArrow16 },
  { src: downArrow16 },
  { src: fourPointStar16 },
  { src: fivePointStar16 },
  { src: sixPointStar16 },
  { src: callout16 },
  { src: ovalCallout16 },
  { src: cloudCallout16 },
  { src: heart16 },
  { src: lightning16 },
];

function ShapesGrid({ ribbonWidth, isOnlyDropdown }) {
  const [currentRow, setCurrentRow] = useState(0);
  const gridRef = useRef();
  const lastColumnCount = useRef(4);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  useOutsideClick(dropdownRef, () => isDropdownOpen && setIsDropdownOpen(false));
  
  let columns = 4;
  if(ribbonWidth >= 1060) columns = 5;
  if(ribbonWidth >= 1080) columns = 6;
  if(ribbonWidth >= 1100) columns = 7;
  const rows = Math.ceil(shapesData.length / columns);
  const maxRow = rows - 3;

  const shapes = shapesData.map(shape => 
    <button className="button" key={shape.src}>
      <img src={shape.src} alt=""/>
    </button>
  );

  useEffect(() => {
    if(lastColumnCount.current !== columns) {
      setCurrentRow(0);
      lastColumnCount.current = columns;
    }
  }, [columns]);
  
  useEffect(() => {
    const gridCellHeight = 22;

    if(gridRef.current)
      gridRef.current.scrollTo({ behavior: 'smooth', top: gridCellHeight * currentRow });
  }, [currentRow]);

  function changeCurrentRow(decrease = false) {
    let newRow = currentRow + (decrease ? -1 : 1);

    if(newRow < 0 || newRow > maxRow)
      return;

    setCurrentRow(newRow);
  }

  return (
    <div className={css['container']}>
      {
        !isOnlyDropdown &&
          <>
            <div 
              className={css['grid']}
              style={{ gridTemplateColumns: `repeat(${columns}, auto)`}}
              ref={gridRef}
            >
              {shapes}
            </div>

            <div>
              <button 
                className={`
                  ${css['button']}
                  ${currentRow === 0 ? css['button--disabled'] : ''}
                  ${currentRow === maxRow ? css['button--has-border'] : ''}
                `}
                onClick={() => changeCurrentRow(true)}
              >
                <TriangleDown className="rotate-180"/>
              </button>
              <button 
                className={`
                  ${css['button']}
                  ${currentRow === maxRow ? css['button--disabled'] : ''}
                `}
                onClick={() => changeCurrentRow(false)}
              >
                <TriangleDown/>
              </button>
              <button 
                className={`
                  ${css['button']}
                  ${currentRow === maxRow ? css['button--has-border'] : ''}
                `}
                onPointerDown={() => toggleBoolState(isDropdownOpen, setIsDropdownOpen)}
              >
                <TriangleLine/>
              </button>
            </div>
          </>
      }

      <Dropdown isVisible={(isDropdownOpen || isOnlyDropdown) ? true : false} classes={`${css['dropdown']} popup`} ref={dropdownRef}>
        <div className={css['expanded']}>
          <div className={css['expanded__grid']}>
            {shapes}
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
      </Dropdown>
    </div>
  );
}

ShapesGrid.propTypes = {
  ribbonWidth: PropTypes.number.isRequired,
  isOnlyDropdown: PropTypes.bool,
};

export default ShapesGrid;