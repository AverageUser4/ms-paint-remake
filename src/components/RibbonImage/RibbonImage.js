import React, { useState, useRef, memo } from "react";
import PropTypes from 'prop-types';
import css from './RibbonImage.module.css';

import BigButtonDuo from '../BigButtonDuo/BigButtonDuo';
import RibbonItemExpanded from "../RibbonItemExpanded/RibbonItemExpanded";
import RibbonItemContainer from '../RibbonItemContainer/RibbonItemContainer';
import useOutsideClick from "../../hooks/useOutsideClick";
import Dropdown from "../Dropdown/Dropdown";
import Tooltip from "../Tooltip/Tooltip";

import { useSelectionContext } from "../../context/SelectionContext";
import { useToolContext } from "../../context/ToolContext";
import { useWindowsContext } from "../../context/WindowsContext";
import { useActionsContext } from "../../context/ActionsContext";

import crop16 from '../../assets/global/crop-16.png';
import selectAll16 from '../../assets/global/select-all-16.png';
import invertSelection16 from '../../assets/global/invert-selection-16.png';
import delete16 from '../../assets/global/delete-16.png';
import rotate16 from '../../assets/global/rotate-16.png';
import resize16 from '../../assets/global/resize-16.png';
import rotate18016 from '../../assets/global/rotate-180-16.png';
import filpHorizontal16 from '../../assets/global/flip-horizontal-16.png';
import filpVertical16 from '../../assets/global/flip-vertical-16.png';
import rotateLeft16 from '../../assets/global/rotate-left-16.png';
import image16 from './assets/image-16.png';
import image32 from './assets/image-32.png';
import freeForm16 from './assets/free-form-16.png';
import freeForm32 from './assets/free-form-32.png';
import { ReactComponent as TriangleDown } from '../../assets/global/triangle-down.svg';

const RibbonImage = memo(function RibbonImage({ ribbonWidth }) {
  const { 
    doSelectionCrop, selectionPhase, doSelectionSelectAll,
    doSelectionInvertSelection, isSelectionTransparent, setIsSelectionTransparent,
  } = useSelectionContext();
  const { currentTool, latestTools } = useToolContext();
  const { 
    doSetCurrentTool, doSharedDelete, doSharedRotate,
    doSharedFlip
  } = useActionsContext();
  const { setIsResizeWindowOpen } = useWindowsContext();
  let icon = image32;
  const disabledData = { isShape: currentTool.startsWith('shape') };
  
  switch(currentTool.startsWith('selection') ? currentTool : latestTools.selection) {
    case 'selection-free-form':
      icon = freeForm32;
      break;
  }
    
  const [isContainerDropdownOpen, setIsContainerDropdownOpen] = useState(false);

  const dropdownContainerRef = useRef();
  const [isSelectionDropdownOpen, setIsSelectionDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  useOutsideClick({
    containerRef: dropdownRef,
    callback: () => setIsSelectionDropdownOpen(false),
    isInvokeOnEscapeKey: true,
  });

  const [isRotateDropdownOpen, setIsRotateDropdownOpen] = useState(false);
  const rotateDropdownRef = useRef();
  useOutsideClick({
    containerRef: rotateDropdownRef,
    callback: () => setIsRotateDropdownOpen(false),
    isInvokeOnEscapeKey: true,
  });

  const isOnlyContent = ribbonWidth >= 840;
  const isShowText = ribbonWidth < 840 || ribbonWidth >= 1000;
  
  return (
    <RibbonItemContainer 
      isOnlyContent={isOnlyContent}
      iconSrc={image16}
      name="Image"
      isDropdownOpen={isContainerDropdownOpen}
      setIsDropdownOpen={setIsContainerDropdownOpen}
    >
      <RibbonItemExpanded name="Image">

          <div 
            className={css['container']}
            data-cy="Image"
          >
            <BigButtonDuo 
              iconSrc={icon} 
              name="Select"
              isShowChildren={isSelectionDropdownOpen}
              setIsShowChildren={setIsSelectionDropdownOpen}
              onClickBottom={(e) => e.button === 0 && setIsSelectionDropdownOpen(prev => !prev)}
              onClickTop={() => { 
                if(!currentTool.startsWith('selection-')) {
                  doSetCurrentTool(latestTools.selection);
                }
                setIsContainerDropdownOpen(false);
              }}
              isActive={currentTool.startsWith('selection-')}
              ariaDescribedByTop="id-image-bbd-top"
              tooltipElementTop={
                <Tooltip
                  ID="id-image-bbd-top"
                  heading="Selection"
                  text="Select a part of the picture."
                />
              }
              ariaDescribedByBottom="id-image-bbd-bottom"
              tooltipElementBottom={
                <Tooltip
                  ID="id-image-bbd-bottom"
                  heading="Selection"
                  text="Click here for selection shapes and options."
                />
              }
            >
              <div 
                className="popup" 
                ref={dropdownRef}
                data-cy="Image-Select-Dropdown"
              >
                <h3 className="popup__head head head--2">Selection shapes</h3>

                <div className="popup__part">
                  <button 
                    className={`
                      tooltip-container popup__button 
                      ${currentTool === 'selection-rectangle' && 'popup__button--selected'}
                      text text--4 text--nowrap
                    `}
                    onClick={() => {
                      doSetCurrentTool('selection-rectangle');
                      setIsSelectionDropdownOpen(false);
                      setIsContainerDropdownOpen(false);
                    }}
                    aria-describedby="id-image-rectangular-selection"
                  >
                    <img draggable="false" className="popup__image" src={image16} alt=""/>
                    <span><span className="text--underline">R</span>ectangular selection</span>
                    <Tooltip
                      ID="id-image-rectangular-selection"
                      text="Select a rectangular area by drawing on the canvas."
                    />
                  </button>

                  <button 
                    className={`
                      tooltip-container popup__button 
                      ${currentTool === 'selection-free-form' && 'popup__button--selected'}
                      text text--4 text--nowrap
                    `}
                    onClick={() => {
                      doSetCurrentTool('selection-free-form');
                      setIsSelectionDropdownOpen(false);
                      setIsContainerDropdownOpen(false);
                    }}
                    aria-describedby="id-image-free-form-selection"
                  >
                    <img draggable="false" className="popup__image" src={freeForm16} alt=""/>
                    <span><span className="text--underline">F</span>ree-form selection</span>
                    <Tooltip
                      ID="id-image-free-form-selection"
                      text="Select an area of any shape by drawing on the canvas."
                    />
                  </button>
                </div>

                <div className="popup__line"></div>
                <h3 className="popup__head head head--2">Selection options</h3>

                <div className="popup__part">
                  <button 
                    className="tooltip-container popup__button text text--4 text--nowrap"
                    onClick={() => {
                      doSelectionSelectAll();
                      setIsSelectionDropdownOpen(false);
                      setIsContainerDropdownOpen(false);
                    }}
                    aria-describedby="id-image-select-all"
                  >
                    <img draggable="false" className="popup__image" src={selectAll16} alt=""/>
                    <span>Select <span className="text--underline">a</span>ll</span>
                    <Tooltip
                      ID="id-image-select-all"
                      heading="Select all (Ctrl+A)"
                      text="Select the entire picture."
                    />
                  </button>

                  {disabledData.invertSelection = selectionPhase !== 2 || currentTool.startsWith('shape')}
                  <button 
                    tabIndex={disabledData.invertSelection ? -1 : 0}
                    className={`
                      tooltip-container
                      popup__button
                      ${(disabledData.invertSelection) ? 'popup__button--disabled' : ''}
                      text text--4 text--nowrap
                    `}
                    onClick={() => {
                      if(disabledData.invertSelection) {
                        return;
                      }
                      doSelectionInvertSelection();
                      setIsSelectionDropdownOpen(false);
                      setIsContainerDropdownOpen(false);
                    }}
                    aria-describedby="id-image-invert"
                  >
                    <img draggable="false" className="popup__image" src={invertSelection16} alt=""/>
                    <span><span className="text--underline">I</span>nvert selection</span>
                    <Tooltip
                      ID="id-image-invert"
                      text="Reverse the current selection."
                    />
                  </button>

                  <button 
                    className="tooltip-container popup__button text text--4 text--nowrap"
                    onClick={() => {
                      doSharedDelete();
                      setIsSelectionDropdownOpen(false);
                      setIsContainerDropdownOpen(false);
                    }}
                    aria-describedby="id-image-delete"
                  >
                    <img draggable="false" className="popup__image" src={delete16} alt=""/>
                    <span><span className="text--underline">D</span>elete</span>
                    <Tooltip
                      ID="id-image-delete"
                      heading="Delete selection"
                      text="Delete the current selection from the canvas."
                    />
                  </button>

                  <label
                    className="tooltip-container popup__button text text--4 text--nowrap"
                  >
                    <input 
                      className="form-checkbox"
                      type="checkbox"
                      checked={isSelectionTransparent}
                      onChange={() => { 
                        setIsSelectionTransparent(prev => !prev); 
                        setIsSelectionDropdownOpen(false);
                        setIsContainerDropdownOpen(false);
                      }}
                      aria-describedby="id-image-transparent"
                    />
                    <span><span className="text--underline">T</span>ransparent selection</span>
                    <Tooltip
                      ID="id-image-transparent"
                      text="Make the background color in the selection transparent or opaque."
                    />
                  </label>
                </div>
              </div>
            </BigButtonDuo>

            {disabledData.crop = selectionPhase !== 2}
            <div data-cy="Image-buttons">
              <button 
                tabIndex={disabledData.crop ? -1 : 0}
                className={`
                  tooltip-container button
                  ${disabledData.crop ? 'button--disabled' : ''}
                `}
                onClick={() => {
                  if(disabledData.crop) {
                    return;
                  }
                  doSelectionCrop(); 
                  setIsContainerDropdownOpen(false);
                }}
                aria-describedby="id-image-crop"
              >
                <img draggable="false" src={crop16} alt="Crop."/>
                {isShowText && <span className="text text--1">Crop</span>}
                <Tooltip
                  ID="id-image-crop"
                  heading="Crop (Ctrl+Shift+X)"
                  text="Crop the picture so it only contains the current selection."
                />
              </button>

              <button 
                className="tooltip-container button"
                onClick={() => { 
                  setIsResizeWindowOpen(true);
                  setIsContainerDropdownOpen(false);
                }}
                data-cy="Image-open-ResizeWindow"
                aria-describedby="id-image-resize"
              >
                <img draggable="false" src={resize16} alt="Resize."/>
                {isShowText && <span className="text text--1">Resize</span>}
                <Tooltip
                  ID="id-image-resize"
                  heading="Resize and skew (Ctrl+W)"
                  text="Resize and skew the picture or selection."
                />
              </button>

              <div className="dropdown-container" ref={dropdownContainerRef}>
                <button 
                  className="tooltip-container button"
                  onClick={(e) => e.button === 0 && setIsRotateDropdownOpen(prev => !prev)}
                  data-cy="Image-toggle-Rotate"
                  aria-describedby="id-image-rotate"
                >
                  <img draggable="false" src={rotate16} alt="Rotate."/>
                  {isShowText && <span className="text text--1">Rotate</span>}
                  <TriangleDown/>
                  <Tooltip
                    ID="id-image-rotate"
                    heading="Rotate or flip"
                    text="Rotate or flip the picture or selection."
                  />
                </button>

                <Dropdown 
                  isVisible={isRotateDropdownOpen}
                  setIsVisible={setIsRotateDropdownOpen}
                  dropdownContainerRef={dropdownContainerRef}
                >
                  <div 
                    className="popup"
                    ref={rotateDropdownRef}
                    data-cy="Image-Rotate-Dropdown"
                  >
                    {disabledData.rotate = currentTool.startsWith('shape') && selectionPhase === 2}
                    <div className="popup__part">
                      <button
                        tabIndex={disabledData.rotate ? -1 : 0}
                        className={`
                          tooltip-container
                          popup__button
                          ${disabledData.rotate ? 'popup__button--disabled' : ''}
                          text text--4 text--nowrap
                        `}
                        aria-describedby="id-image-rotate-right-90"
                        onClick={() => {
                          if(disabledData.rotate) {
                            return;
                          }
                          doSharedRotate(90);
                          setIsRotateDropdownOpen(false);
                          setIsContainerDropdownOpen(false);
                        }}
                      >
                        <img draggable="false" className="popup__image" src={rotate16} alt=""/>
                        <span>Rotate <span className="text--underline">r</span>ight 90°</span>
                        <Tooltip
                          ID="id-image-rotate-right-90"
                          text="Rotate the picture or selection by 90 degrees right."
                        />
                      </button>

                      <button
                        tabIndex={disabledData.rotate ? -1 : 0}
                        className={`
                          tooltip-container
                          popup__button
                          ${disabledData.rotate ? 'popup__button--disabled' : ''}
                          text text--4 text--nowrap
                        `}
                        aria-describedby="id-image-rotate-left-90"
                        onClick={() => {
                          if(disabledData.rotate) {
                            return;
                          }
                          doSharedRotate(-90);
                          setIsRotateDropdownOpen(false);
                          setIsContainerDropdownOpen(false);
                        }}
                      >
                        <img draggable="false" className="popup__image" src={rotateLeft16} alt=""/>
                        <span>Rotate <span className="text--underline">l</span>eft 90°</span>
                        <Tooltip
                          ID="id-image-rotate-left-90"
                          text="Rotate the picture or selection by 90 degrees left."
                        />
                      </button>

                      <button
                        tabIndex={disabledData.rotate ? -1 : 0}
                        className={`
                          tooltip-container
                          popup__button
                          ${disabledData.rotate ? 'popup__button--disabled' : ''}
                          text text--4 text--nowrap
                        `}
                        aria-describedby="id-image-rotate-180"
                        onClick={() => {
                          if(disabledData.rotate) {
                            return;
                          }
                          doSharedRotate(180);
                          setIsRotateDropdownOpen(false);
                          setIsContainerDropdownOpen(false);
                        }}
                      >
                        <img draggable="false" className="popup__image" src={rotate18016} alt=""/>
                        <span>Ro<span className="text--underline">t</span>ate 180°</span>
                        <Tooltip
                          ID="id-image-rotate-180"
                          text="Rotate the picture or selection by 180 degrees."
                        />
                      </button>

                      <button
                        tabIndex={disabledData.rotate ? -1 : 0}
                        className={`
                          tooltip-container
                          popup__button
                          ${disabledData.rotate ? 'popup__button--disabled' : ''}
                          text text--4 text--nowrap
                        `}
                        aria-describedby="id-image-flip-vertical"
                        onClick={() => {
                          if(disabledData.rotate) {
                            return;
                          }
                          doSharedFlip('vertical');
                          setIsRotateDropdownOpen(false);
                          setIsContainerDropdownOpen(false);
                        }}
                      >
                        <img draggable="false" className="popup__image" src={filpVertical16} alt=""/>
                        <span>Flip <span className="text--underline">v</span>ertical</span>
                        <Tooltip
                          ID="id-image-flip-vertical"
                          text="Flip the picture or selection vertically."
                        />
                      </button>

                      <button
                        tabIndex={disabledData.rotate ? -1 : 0}
                        className={`
                          tooltip-container
                          popup__button
                          ${disabledData.rotate ? 'popup__button--disabled' : ''}
                          text text--4 text--nowrap
                        `}
                        aria-describedby="id-image-flip-horizontal"
                        onClick={() => {
                          if(disabledData.rotate) {
                            return;
                          }
                          doSharedFlip('horizontal');
                          setIsRotateDropdownOpen(false);
                          setIsContainerDropdownOpen(false);
                        }}
                      >
                        <img draggable="false" className="popup__image" src={filpHorizontal16} alt=""/>
                        <span>Flip <span className="text--underline">h</span>orizontal</span>
                        <Tooltip
                          ID="id-image-flip-horizontal"
                          text="Flip the picture or selection horizontally."
                        />
                      </button>
                    </div>
                  </div>
                </Dropdown>
              </div>
            </div>
          </div>

      </RibbonItemExpanded>

      <div className="vertical-line"></div>

    </RibbonItemContainer>
  );
});

RibbonImage.propTypes = {
  ribbonWidth: PropTypes.number.isRequired,
};

export default RibbonImage;