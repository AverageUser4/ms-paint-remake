import React, { memo, useRef, useState } from "react";
import PropTypes from 'prop-types';
import css from './RibbonShapes.module.css';

import BigButton from '../BigButton/BigButton';
import ShapesGrid from "../ShapesGrid/ShapesGrid";
import RibbonItemExpanded from "../RibbonItemExpanded/RibbonItemExpanded";
import RibbonItemContainer from "../RibbonItemContainer/RibbonItemContainer";
import Tooltip from "../Tooltip/Tooltip";

import Dropdown from "../Dropdown/Dropdown";
import useOutsideClick from "../../hooks/useOutsideClick";
import { useToolContext } from "../../context/ToolContext";

import shapes16 from './assets/shapes-16.png';
import shapes32 from './assets/shapes-32.png';
import fill16 from './assets/fill-16.png';
import outline16 from './assets/outline-16.png';
import none16 from './assets/none-16.png';
import crayon16 from './assets/crayon-16.png';
import marker16 from './assets/marker-16.png';
import oil16 from './assets/oil-16.png';
import pencil16 from './assets/pencil-16.png';
import waterColor16 from './assets/water-color-16.png';
import solidColor16 from './assets/solid-color-16.png';
import { ReactComponent as TriangleDown } from '../../assets/global/triangle-down.svg';

const RibbonShapes = memo(function RibbonShapes({ ribbonWidth }) {
  const { shapeData, setShapeData } = useToolContext();
  
  const [isContainerDropdownOpen, setIsContainerDropdownOpen] = useState(false);

  const [isFillDropdownOpen, setIsFillDropdownOpen] = useState(false);
  const fillDropdownRef = useRef();
  const fillDropdownContainerRef = useRef();
  useOutsideClick({
    containerRef: fillDropdownRef,
    callback: () => setIsFillDropdownOpen(false),
    isInvokeOnEscapeKey: true,
  });

  const [isOutlineDropdownOpen, setIsOutlineDropdownOpen] = useState(false);
  const outlineDropdownRef = useRef();
  const outlineDropdownContainerRef = useRef();
  useOutsideClick({
    containerRef: outlineDropdownRef,
    callback: () => setIsOutlineDropdownOpen(false),
    isInvokeOnEscapeKey: true,
  });

  const [isGridDropdownOpen, setIsGridDropdownOpen] = useState(false);
  const gridDropdownRef = useRef();
  const gridDropdownContainerRef = useRef();
  useOutsideClick({
    containerRef: gridDropdownRef,
    callback: () => setIsGridDropdownOpen(false),
    isInvokeOnEscapeKey: true,
  });
  
  const isOnlyContent = ribbonWidth >= 800;
  const isShowText = ribbonWidth < 800 || ribbonWidth >= 900;
  const isBigButtonHidden = ribbonWidth < 800 || ribbonWidth >= 950;

  return (
    <RibbonItemContainer 
      isOnlyContent={isOnlyContent}
      iconSrc={shapes16}
      name="Shapes"
      isDropdownOpen={isContainerDropdownOpen}
      setIsDropdownOpen={setIsContainerDropdownOpen}
    >
      <RibbonItemExpanded name="Shapes">

        <div 
          className={css['container']}
          data-cy="Shapes"
        >
          <div className="dropdown-container" ref={gridDropdownContainerRef}>
            <BigButton
              iconSrc={shapes32}
              name="Shapes"
              strName="Shapes"
              isHasArrow={true}
              isOnlyChildren={isBigButtonHidden}
              onClick={(e) => e.button === 0 && setIsGridDropdownOpen(prev => !prev)}
              ariaDescribedBy="id-shapes-big-button"
              tooltipElement={
                <Tooltip
                  ID="id-shapes-big-button"
                  heading="Shapes"
                  text="Insert ready-made shapes such as rectangles and circles, triangles, arrows, stars, and callouts."
                />
              }
            >
              <ShapesGrid
                ribbonWidth={ribbonWidth}
                setIsGridDropdownOpen={setIsGridDropdownOpen}
              />
            </BigButton>

            <Dropdown 
              isVisible={isGridDropdownOpen}
              setIsVisible={setIsGridDropdownOpen}
              dropdownContainerRef={gridDropdownContainerRef}
            >
              <div className="popup" ref={gridDropdownRef}>
                <ShapesGrid
                  ribbonWidth={ribbonWidth}
                  setIsGridDropdownOpen={setIsGridDropdownOpen}
                  isOnlyDropdown={true}
                />
              </div>
            </Dropdown>
          </div>

          <div data-cy="Shapes-buttons">
            <div className="dropdown-container" ref={outlineDropdownContainerRef}>
              <button 
                className="tooltip-container button"
                onClick={(e) => e.button === 0 && setIsOutlineDropdownOpen(prev => !prev)}
                data-cy="Shapes-toggle-Outline"
                aria-describedby="id-shapes-outline"
              >
                <img draggable="false" src={outline16} alt="Outline."/>
                {isShowText && <span className="text text--1">Outline</span>}
                <TriangleDown/>
                <Tooltip
                  ID="id-shapes-outline"
                  heading="Shape outline"
                  text="Select the medium for the shape outline."
                />
              </button>

              <Dropdown 
                isVisible={isOutlineDropdownOpen}
                setIsVisible={setIsOutlineDropdownOpen}
                dropdownContainerRef={outlineDropdownContainerRef}
              >
                <div 
                  className="popup"
                  ref={outlineDropdownRef}
                  data-cy="Shapes-Outline-Dropdown"
                >
                  <div className="popup__part">
                    <button 
                      className={`
                        popup__button
                        ${shapeData.outline === '' ? 'popup__button--active' : ''}
                        text text--4 text--nowrap
                      `}
                      onClick={() => {
                        setShapeData(prev => ({ ...prev, outline: '' }));
                        setIsOutlineDropdownOpen(false);
                      }}
                    >
                      <img className="popup__image" src={none16} alt=""/>
                      <span>No outline</span>
                    </button>

                    <button 
                      className={`
                        popup__button
                        ${shapeData.outline === 'solid' ? 'popup__button--active' : ''}
                        text text--4 text--nowrap
                      `}
                      onClick={() => {
                        setShapeData(prev => ({ ...prev, outline: 'solid' }));
                        setIsOutlineDropdownOpen(false);
                      }}
                    >
                      <img className="popup__image" src={solidColor16} alt=""/>
                      <span>Solid color</span>
                    </button>

                    <button 
                      className={`
                        popup__button
                        ${shapeData.outline === 'crayon' ? 'popup__button--active' : ''}
                        text text--4 text--nowrap
                      `}
                      onClick={() => {
                        setShapeData(prev => ({ ...prev, outline: 'crayon' }));
                        setIsOutlineDropdownOpen(false);
                      }}
                    >
                      <img className="popup__image" src={crayon16} alt=""/>
                      <span>Crayon</span>
                    </button>

                    <button 
                      className={`
                        popup__button
                        ${shapeData.outline === 'marker' ? 'popup__button--active' : ''}
                        text text--4 text--nowrap
                      `}
                      onClick={() => {
                        setShapeData(prev => ({ ...prev, outline: 'marker' }));
                        setIsOutlineDropdownOpen(false);
                      }}
                    >
                      <img className="popup__image" src={marker16} alt=""/>
                      <span>Marker</span>
                    </button>

                    <button 
                      className={`
                        popup__button
                        ${shapeData.outline === 'oil' ? 'popup__button--active' : ''}
                        text text--4 text--nowrap
                      `}
                      onClick={() => {
                        setShapeData(prev => ({ ...prev, outline: 'oil' }));
                        setIsOutlineDropdownOpen(false);
                      }}
                    >
                      <img className="popup__image" src={oil16} alt=""/>
                      <span>Oil</span>
                    </button>

                    <button 
                      className={`
                        popup__button
                        ${shapeData.outline === 'pencil' ? 'popup__button--active' : ''}
                        text text--4 text--nowrap
                      `}
                      onClick={() => {
                        setShapeData(prev => ({ ...prev, outline: 'pencil' }));
                        setIsOutlineDropdownOpen(false);
                      }}
                    >
                      <img className="popup__image" src={pencil16} alt=""/>
                      <span>Natural pencil</span>
                    </button>

                    <button 
                      className={`
                        popup__button
                        ${shapeData.outline === 'watercolor' ? 'popup__button--active' : ''}
                        text text--4 text--nowrap
                      `}
                      onClick={() => {
                        setShapeData(prev => ({ ...prev, outline: 'watercolor' }));
                        setIsOutlineDropdownOpen(false);
                      }}
                    >
                      <img className="popup__image" src={waterColor16} alt=""/>
                      <span>Watercolor</span>
                    </button>
                  </div>
                </div>
              </Dropdown>
            </div>

            <div className="dropdown-container" ref={fillDropdownContainerRef}>
              <button 
                className="tooltip-container button"
                onClick={(e) => e.button === 0 && setIsFillDropdownOpen(prev => !prev)}
                data-cy="Shapes-toggle-Fill"
                aria-describedby="id-shapes-fill"
              >
                <img draggable="false" src={fill16} alt="Fill."/>
                {isShowText && <span className="text text--1">Fill</span>}
                <TriangleDown/>
                <Tooltip
                  ID="id-shapes-fill"
                  heading="Shape fill"
                  text="Select the medium for the shape fill."
                />
              </button>

              <Dropdown 
                isVisible={isFillDropdownOpen}
                setIsVisible={setIsFillDropdownOpen}
                dropdownContainerRef={fillDropdownContainerRef}
              >
                <div 
                  className="popup"
                  ref={fillDropdownRef}
                  data-cy="Shapes-Fill-Dropdown"
                >
                  <div className="popup__part">
                    <button 
                      className={`
                        popup__button
                        ${shapeData.fill === '' ? 'popup__button--active' : ''}
                        text text--4 text--nowrap
                      `}
                      onClick={() => {
                        setShapeData(prev => ({ ...prev, fill: '' }));
                        setIsFillDropdownOpen(false);
                      }}
                    >
                      <img className="popup__image" src={none16} alt=""/>
                      <span>No fill</span>
                    </button>

                    <button 
                      className={`
                        popup__button
                        ${shapeData.fill === 'solid' ? 'popup__button--active' : ''}
                        text text--4 text--nowrap
                      `}
                      onClick={() => {
                        setShapeData(prev => ({ ...prev, fill: 'solid' }));
                        setIsFillDropdownOpen(false);
                      }}
                    >
                      <img className="popup__image" src={solidColor16} alt=""/>
                      <span>Solid color</span>
                    </button>

                    <button 
                      className={`
                        popup__button
                        ${shapeData.fill === 'crayon' ? 'popup__button--active' : ''}
                        text text--4 text--nowrap
                      `}
                      onClick={() => {
                        setShapeData(prev => ({ ...prev, fill: 'crayon' }));
                        setIsFillDropdownOpen(false);
                      }}
                    >
                      <img className="popup__image" src={crayon16} alt=""/>
                      <span>Crayon</span>
                    </button>

                    <button 
                      className={`
                        popup__button
                        ${shapeData.fill === 'marker' ? 'popup__button--active' : ''}
                        text text--4 text--nowrap
                      `}
                      onClick={() => {
                        setShapeData(prev => ({ ...prev, fill: 'marker' }));
                        setIsFillDropdownOpen(false);
                      }}
                    >
                      <img className="popup__image" src={marker16} alt=""/>
                      <span>Marker</span>
                    </button>

                    <button 
                      className={`
                        popup__button
                        ${shapeData.fill === 'oil' ? 'popup__button--active' : ''}
                        text text--4 text--nowrap
                      `}
                      onClick={() => {
                        setShapeData(prev => ({ ...prev, fill: 'oil' }));
                        setIsFillDropdownOpen(false);
                      }}
                    >
                      <img className="popup__image" src={oil16} alt=""/>
                      <span>Oil</span>
                    </button>

                    <button 
                      className={`
                        popup__button
                        ${shapeData.fill === 'pencil' ? 'popup__button--active' : ''}
                        text text--4 text--nowrap
                      `}
                      onClick={() => {
                        setShapeData(prev => ({ ...prev, fill: 'pencil' }));
                        setIsFillDropdownOpen(false);
                      }}
                    >
                      <img className="popup__image" src={pencil16} alt=""/>
                      <span>Natural pencil</span>
                    </button>

                    <button 
                      className={`
                        popup__button
                        ${shapeData.fill === 'watercolor' ? 'popup__button--active' : ''}
                        text text--4 text--nowrap
                      `}
                      onClick={() => {
                        setShapeData(prev => ({ ...prev, fill: 'watercolor' }));
                        setIsFillDropdownOpen(false);
                      }}
                    >
                      <img className="popup__image" src={waterColor16} alt=""/>
                      <span>Watercolor</span>
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

RibbonShapes.propTypes = {
  ribbonWidth: PropTypes.number.isRequired,
};

export default RibbonShapes;