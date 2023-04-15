import React, { useState, useRef, useEffect, memo } from "react";
import PropTypes from 'prop-types';
import css from './ShapesGrid.module.css';

import Dropdown from '../Dropdown/Dropdown';
import Tooltip from "../Tooltip/Tooltip";

import useOutsideClick from "../../hooks/useOutsideClick";
import { useToolContext } from "../../context/ToolContext";

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

const shapesDataArray = [
  { src: line16, name: 'Line' },
  { src: curve16, name: 'Curve' },
  { src: oval16, name: 'Oval' },
  { src: rectangle16, name: 'Rectangle' },
  { src: roundedRectangle16, name: 'Rounded rectangle' },
  { src: polygon16, name: 'Polygon' },
  { src: triangle16, name: 'Triangle' },
  { src: rightTriangle16, name: 'Right triangle' },
  { src: diamond16, name: 'Diamond' },
  { src: pentagon16, name: 'Pentagon' },
  { src: hexagon16, name: 'Hexagon' },
  { src: rightArrow16, name: 'Right arrow' },
  { src: leftArrow16, name: 'Left arrow' },
  { src: upArrow16, name: 'Up arrow' },
  { src: downArrow16, name: 'Down arrow' },
  { src: fourPointStar16, name: 'Four-point star' },
  { src: fivePointStar16, name: 'Five-point star' },
  { src: sixPointStar16, name: 'Six-point star' },
  { src: callout16, name: 'Rounded rectangular callout' },
  { src: ovalCallout16, name: 'Oval callout', isDisabled: true },
  { src: cloudCallout16, name: 'Cloud callout', isDisabled: true },
  { src: heart16, name: 'Heart' },
  { src: lightning16, name: 'Lightning' },
];

const ShapesGrid = memo(function ShapesGrid({ ribbonWidth, isOnlyDropdown, setIsGridDropdownOpen }) {
  const { currentTool, setCurrentTool } = useToolContext();
  
  const [currentRow, setCurrentRow] = useState(0);
  const gridRef = useRef();
  const lastColumnCountRef = useRef(4);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  useOutsideClick({
    containerRef: dropdownRef,
    callback: () => setIsDropdownOpen(false),
    isInvokeOnEscapeKey: true,
  });
  
  let columns = 4;
  if(ribbonWidth >= 1060) columns = 5;
  if(ribbonWidth >= 1080) columns = 6;
  if(ribbonWidth >= 1100) columns = 7;
  const rows = Math.ceil(shapesDataArray.length / columns);
  const maxRow = rows - 3;
  const disabledData = {};

  function mapToButtons(isOut, shape) {
    const id = shape.name.toLowerCase().replace(/ /g, '-');
    
    return (
      <button
        tabIndex={shape.isDisabled ? -1 : 0}
        key={id}
        className={`
          button
          tooltip-container 
          ${currentTool === `shape-${id}` ? 'button--active' : ''}
          ${isOut ? 'tooltip-container--out' : ''}
          ${shape.isDisabled ? 'button--disabled' : ''}
        `}
        aria-label={shape.name}
        onClick={() => { 
          if(shape.isDisabled) {
            return;
          }
          setCurrentTool(`shape-${id}`); 
          setIsGridDropdownOpen(false);
          setIsDropdownOpen(false);
        }}
      >
        <img draggable="false" src={shape.src} alt=""/>
        <Tooltip
          text={shape.name}
        />
      </button>
    );
  }
  
  const shapeButtonsTooltipIn = shapesDataArray.map(mapToButtons.bind(null, false));
  const shapeButtonsTooltipOut = shapesDataArray.map(mapToButtons.bind(null, true));

  useEffect(() => {
    if(lastColumnCountRef.current !== columns) {
      setCurrentRow(0);
      lastColumnCountRef.current = columns;
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
    <div 
      className={css['container']}
      data-cy="ShapesGrid"
    >
      {
        !isOnlyDropdown &&
          <>
            <div 
              className={css['grid']}
              style={{ gridTemplateColumns: `repeat(${columns}, auto)`}}
              ref={gridRef}
            >
              {shapeButtonsTooltipOut}
            </div>

            <div>
              {disabledData.up = currentRow === 0}
              <button 
                tabIndex={disabledData.up ? -1 : 0}
                className={`
                  ${css['button']}
                  ${disabledData.up ? css['button--disabled'] : ''}
                  ${currentRow === maxRow ? css['button--has-border'] : ''}
                `}
                onClick={() => {
                  if(disabledData.up) {
                    return;
                  }
                  changeCurrentRow(true)
                }}
              >
                <TriangleDown className="rotate-180"/>
              </button>
              {disabledData.down = currentRow === maxRow}
              <button 
                tabIndex={disabledData.down ? -1 : 0}
                className={`
                  ${css['button']}
                  ${disabledData.down ? css['button--disabled'] : ''}
                `}
                onClick={() => {
                  if(disabledData.down) {
                    return;
                  }
                  changeCurrentRow(false)
                }}
              >
                <TriangleDown/>
              </button>
              <button 
                className={`
                  ${css['button']}
                  ${currentRow === maxRow ? css['button--has-border'] : ''}
                `}
                onClick={(e) => e.button === 0 && setIsDropdownOpen(prev => !prev)}
                data-cy="ShapesGrid-toggle-Dropdown"
              >
                <TriangleLine/>
              </button>
            </div>
          </>
      }

      <Dropdown 
        isVisible={(isDropdownOpen || isOnlyDropdown) ? true : false}
        setIsVisible={isOnlyDropdown ? null : setIsDropdownOpen}
        classes={`${css['dropdown']} popup`}
        ref={dropdownRef}
        dropdownContainerRef={dropdownRef}
      >
        <div 
          className={css['expanded']}
          data-cy="ShapesGrid-Dropdown"
        >
          <div className={css['expanded__grid']}>
            {shapeButtonsTooltipIn}
          </div>

          <div className={css['expanded__scrollbar']}>
            <button tabIndex={-1} className={`${css['expanded__scrollbar__button']} ${css['expanded__scrollbar__button--disabled']}`}>
              <TriangleDown className="rotate-180"/>
            </button>
            <button tabIndex={-1} className={`${css['expanded__scrollbar__button']} ${css['expanded__scrollbar__button--disabled']}`}>
              <TriangleDown/>
            </button>
          </div>
        </div>
      </Dropdown>
    </div>
  );
});

ShapesGrid.propTypes = {
  ribbonWidth: PropTypes.number.isRequired,
  setIsGridDropdownOpen: PropTypes.func.isRequired,
  isOnlyDropdown: PropTypes.bool,
};

export default ShapesGrid;