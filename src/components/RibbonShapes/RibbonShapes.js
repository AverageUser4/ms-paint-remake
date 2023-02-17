import React, { useRef, useState } from "react";
import PropTypes from 'prop-types';
import css from './RibbonShapes.module.css';

import BigButton from '../BigButton/BigButton';
import ShapesGrid from "../ShapesGrid/ShapesGrid";
import RibbonItemExpanded from "../RibbonItemExpanded/RibbonItemExpanded";
import RibbonItemContainer from "../RibbonItemContainer/RibbonItemContainer";
import Dropdown from "../Dropdown/Dropdown";
import useOutsideClick from "../../hooks/useOutsideClick";
import { toggleBoolState } from "../../misc/utils";

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

function RibbonShapes({ ribbonWidth }) {
  const [isFillDropdownOpen, setIsFillDropdownOpen] = useState(false);
  const fillDropdownRef = useRef();
  const fillDropdownContainerRef = useRef();
  useOutsideClick(fillDropdownRef, () => isFillDropdownOpen && setIsFillDropdownOpen(false));

  const [isOutlineDropdownOpen, setIsOutlineDropdownOpen] = useState(false);
  const outlineDropdownRef = useRef();
  const outlineDropdownContainerRef = useRef();
  useOutsideClick(outlineDropdownRef, () => isOutlineDropdownOpen && setIsOutlineDropdownOpen(false));

  const [isGridDropdownOpen, setIsGridDropdownOpen] = useState(false);
  const gridDropdownRef = useRef();
  const gridDropdownContainerRef = useRef();
  useOutsideClick(gridDropdownRef, () => isGridDropdownOpen && setIsGridDropdownOpen(false));
  
  const isOnlyContent = ribbonWidth >= 800;
  const showText = ribbonWidth < 800 || ribbonWidth >= 900;
  const isBigButtonHidden = ribbonWidth < 800 || ribbonWidth >= 950;

  return (
    <RibbonItemContainer isOnlyContent={isOnlyContent} icon={shapes16} name="Shapes">
      <RibbonItemExpanded name="Shapes">

        <div className={css['container']}>
          <div className="dropdown-container" ref={gridDropdownContainerRef}>
            <BigButton 
              icon={shapes32}
              name="Shapes"
              isOnlyChildren={isBigButtonHidden}
              onPointerDown={(e) => e.button === 0 && toggleBoolState(isGridDropdownOpen, setIsGridDropdownOpen)}
            >
              <ShapesGrid
                ribbonWidth={ribbonWidth}
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
                  isOnlyDropdown={true}
                />
              </div>
            </Dropdown>
          </div>

          <div>
            <div className="dropdown-container" ref={outlineDropdownContainerRef}>
              <button 
                className="button"
                onPointerDown={(e) => e.button === 0 && toggleBoolState(isOutlineDropdownOpen, setIsOutlineDropdownOpen)}
              >
                <img draggable="false" src={outline16} alt="Outline."/>
                {showText && <span className="text text--1">Outline</span>}
                <TriangleDown/>
              </button>

              <Dropdown 
                isVisible={isOutlineDropdownOpen}
                setIsVisible={setIsOutlineDropdownOpen}
                dropdownContainerRef={outlineDropdownContainerRef}
              >
                <div className="popup" ref={outlineDropdownRef}>
                  <button className="popup__button text text--4 text--nowrap">
                    <img className="popup__image" src={none16} alt=""/>
                    <span>No outline</span>
                  </button>

                  <button className="popup__button text text--4 text--nowrap">
                    <img className="popup__image" src={solidColor16} alt=""/>
                    <span>Solid color</span>
                  </button>

                  <button className="popup__button text text--4 text--nowrap">
                    <img className="popup__image" src={crayon16} alt=""/>
                    <span>Crayon</span>
                  </button>

                  <button className="popup__button text text--4 text--nowrap">
                    <img className="popup__image" src={marker16} alt=""/>
                    <span>Marker</span>
                  </button>

                  <button className="popup__button text text--4 text--nowrap">
                    <img className="popup__image" src={oil16} alt=""/>
                    <span>Oil</span>
                  </button>

                  <button className="popup__button text text--4 text--nowrap">
                    <img className="popup__image" src={pencil16} alt=""/>
                    <span>Natural pencil</span>
                  </button>

                  <button className="popup__button text text--4 text--nowrap">
                    <img className="popup__image" src={waterColor16} alt=""/>
                    <span>Watercolor</span>
                  </button>
                </div>
              </Dropdown>
            </div>

            <div className="dropdown-container" ref={fillDropdownContainerRef}>
              <button 
                className="button"
                onPointerDown={(e) => e.button === 0 && toggleBoolState(isFillDropdownOpen, setIsFillDropdownOpen)}
              >
                <img draggable="false" src={fill16} alt="Fill."/>
                {showText && <span className="text text--1">Fill</span>}
                <TriangleDown/>
              </button>

              <Dropdown 
                isVisible={isFillDropdownOpen}
                setIsVisible={setIsFillDropdownOpen}
                dropdownContainerRef={fillDropdownContainerRef}
              >
                <div className="popup" ref={fillDropdownRef}>
                <button className="popup__button text text--4 text--nowrap">
                    <img className="popup__image" src={none16} alt=""/>
                    <span>No fill</span>
                  </button>

                  <button className="popup__button text text--4 text--nowrap">
                    <img className="popup__image" src={solidColor16} alt=""/>
                    <span>Solid color</span>
                  </button>

                  <button className="popup__button text text--4 text--nowrap">
                    <img className="popup__image" src={crayon16} alt=""/>
                    <span>Crayon</span>
                  </button>

                  <button className="popup__button text text--4 text--nowrap">
                    <img className="popup__image" src={marker16} alt=""/>
                    <span>Marker</span>
                  </button>

                  <button className="popup__button text text--4 text--nowrap">
                    <img className="popup__image" src={oil16} alt=""/>
                    <span>Oil</span>
                  </button>

                  <button className="popup__button text text--4 text--nowrap">
                    <img className="popup__image" src={pencil16} alt=""/>
                    <span>Natural pencil</span>
                  </button>

                  <button className="popup__button text text--4 text--nowrap">
                    <img className="popup__image" src={waterColor16} alt=""/>
                    <span>Watercolor</span>
                  </button>
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

RibbonShapes.propTypes = {
  ribbonWidth: PropTypes.number.isRequired,
};

export default RibbonShapes;