import React, { useState, useRef } from "react";
import PropTypes from 'prop-types';
import css from './RibbonImage.module.css';

import BigButtonDuo from '../BigButtonDuo/BigButtonDuo';
import RibbonItemExpanded from "../RibbonItemExpanded/RibbonItemExpanded";
import RibbonItemContainer from '../RibbonItemContainer/RibbonItemContainer';
import useOutsideClick from "../../hooks/useOutsideClick";
import Dropdown from "../Dropdown/Dropdown";
import { toggleBoolState } from "../../misc/utils";
import { useSelectionContext } from "../../misc/SelectionContext";
import { useToolContext } from "../../misc/ToolContext";
import { useWindowsContext } from "../../misc/WindowsContext";

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

function RibbonImage({ ribbonWidth }) {
  const { 
    doSelectionCrop, selectionPhase, doSelectionSelectAll,
    doSelectionInvertSelection, doSharedDelete
  } = useSelectionContext();
  const { currentTool, doSetCurrentTool, latestTools } = useToolContext();
  const { setIsResizeWindowOpen } = useWindowsContext();
  let icon = image32;
  
  switch(currentTool.startsWith('selection') ? currentTool : latestTools.selection) {
    case 'selection-free-form':
      icon = freeForm32;
      break;
  }
    
  const dropdownContainerRef = useRef();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  useOutsideClick(dropdownRef, () => isDropdownOpen && setIsDropdownOpen(false));

  const [isRotateDropdownOpen, setIsRotateDropdownOpen] = useState(false);
  const rotateDropdownRef = useRef();
  useOutsideClick(rotateDropdownRef, () => isRotateDropdownOpen && setIsRotateDropdownOpen(false));

  const isOnlyContent = ribbonWidth >= 840;
  const showText = ribbonWidth < 840 || ribbonWidth >= 1000;
  
  return (
    <RibbonItemContainer isOnlyContent={isOnlyContent} icon={image16} name="Image">
      <RibbonItemExpanded name="Image">

          <div 
            className={css['container']}
            data-cy="Image"
          >
            <BigButtonDuo 
              icon={icon} 
              name="Select"
              showChildren={isDropdownOpen}
              setShowChildren={setIsDropdownOpen}
              onPointerDownBottom={(e) => e.button === 0 && toggleBoolState(isDropdownOpen, setIsDropdownOpen)}
              onPointerDownTop={() => !currentTool.startsWith('selection-') && doSetCurrentTool(latestTools.selection)}
              isActive={currentTool.startsWith('selection-')}
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
                      popup__button 
                      ${currentTool === 'selection-rectangle' && 'popup__button--selected'}
                      text text--4 text--nowrap
                    `}
                    onClick={() => doSetCurrentTool('selection-rectangle')}
                  >
                    <img draggable="false" className="popup__image" src={image16} alt=""/>
                    <span><span className="text--underline">R</span>ectangular selection</span>
                  </button>

                  <button 
                    className={`
                      popup__button 
                      ${currentTool === 'selection-free-form' && 'popup__button--selected'}
                      text text--4 text--nowrap
                    `}
                    onClick={() => doSetCurrentTool('selection-free-form')}
                  >
                    <img draggable="false" className="popup__image" src={freeForm16} alt=""/>
                    <span><span className="text--underline">F</span>ree-form selection</span>
                  </button>
                </div>

                <div className="popup__line"></div>
                <h3 className="popup__head head head--2">Selection options</h3>

                <div className="popup__part">
                  <button 
                    className="popup__button text text--4 text--nowrap"
                    onClick={() => {
                      doSelectionSelectAll();
                      setIsDropdownOpen(false);
                    }}
                  >
                    <img draggable="false" className="popup__image" src={selectAll16} alt=""/>
                    <span>Select <span className="text--underline">a</span>ll</span>
                  </button>

                  <button 
                    disabled={selectionPhase !== 2}
                    className="popup__button text text--4 text--nowrap"
                    onClick={() => {
                      doSelectionInvertSelection();
                      setIsDropdownOpen(false);
                    }}
                  >
                    <img draggable="false" className="popup__image" src={invertSelection16} alt=""/>
                    <span><span className="text--underline">I</span>nvert selection</span>
                  </button>

                  <button 
                    className="popup__button text text--4 text--nowrap"
                    onClick={() => {
                      doSharedDelete();
                      setIsDropdownOpen(false);
                    }}
                  >
                    <img draggable="false" className="popup__image" src={delete16} alt=""/>
                    <span><span className="text--underline">D</span>elete</span>
                  </button>

                  <button className="popup__button text text--4 text--nowrap">
                    <span className="popup__image"></span>
                    <span><span className="text--underline">T</span>ransparent selection</span>
                  </button>
                </div>
              </div>
            </BigButtonDuo>

            <div data-cy="Image-buttons">
              <button 
                className="button"
                onPointerDown={() => doSelectionCrop()}
                disabled={selectionPhase !== 2}
              >
                <img draggable="false" src={crop16} alt="Crop."/>
                {showText && <span className="text text--1">Crop</span>}
              </button>

              <button 
                className="button"
                onClick={() => setIsResizeWindowOpen(true)}
                data-cy="Image-open-ResizeWindow"
              >
                <img draggable="false" src={resize16} alt="Resize."/>
                {showText && <span className="text text--1">Resize</span>}
              </button>

              <div className="dropdown-container" ref={dropdownContainerRef}>
                <button 
                  className="button"
                  onPointerDown={(e) => e.button === 0 && toggleBoolState(isRotateDropdownOpen, setIsRotateDropdownOpen)}
                  data-cy="Image-toggle-Rotate"
                >
                  <img draggable="false" src={rotate16} alt="Rotate."/>
                  {showText && <span className="text text--1">Rotate</span>}
                  <TriangleDown/>
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
                    <div className="popup__part">
                      <button className="popup__button text text--4 text--nowrap">
                        <img draggable="false" className="popup__image" src={rotate16} alt=""/>
                        <span>Rotate <span className="text--underline">r</span>ight 90°</span>
                      </button>

                      <button className="popup__button text text--4 text--nowrap">
                        <img draggable="false" className="popup__image" src={rotateLeft16} alt=""/>
                        <span>Rotate <span className="text--underline">l</span>eft 90°</span>
                      </button>

                      <button className="popup__button text text--4 text--nowrap">
                        <img draggable="false" className="popup__image" src={rotate18016} alt=""/>
                        <span>Ro<span className="text--underline">t</span>ate 180°</span>
                      </button>

                      <button className="popup__button text text--4 text--nowrap">
                        <img draggable="false" className="popup__image" src={filpVertical16} alt=""/>
                        <span>Flip <span className="text--underline">v</span>ertical</span>
                      </button>

                      <button className="popup__button text text--4 text--nowrap">
                        <img draggable="false" className="popup__image" src={filpHorizontal16} alt=""/>
                        <span>Flip <span className="text--underline">h</span>orizontal</span>
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
}

RibbonImage.propTypes = {
  ribbonWidth: PropTypes.number.isRequired,
};

export default RibbonImage;