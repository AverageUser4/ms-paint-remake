import React, { useRef, useState } from "react";
import PropTypes from 'prop-types';
import css from './RibbonClipboard.module.css';

import BigButtonDuo from '../BigButtonDuo/BigButtonDuo';
import RibbonItemExpanded from "../RibbonItemExpanded/RibbonItemExpanded";
import RibbonItemContainer from "../RibbonItemContainer/RibbonItemContainer";
import useOutsideClick from "../../hooks/useOutsideClick";
import { toggleBoolState } from "../../misc/utils";

import clipboard32 from './assets/clipboard-32.png';
import clipboard16 from './assets/clipboard-16.png';
import pasteFrom16 from './assets/paste-from-16.png';
import copy16 from './assets/copy-16.png';
import cut16 from './assets/cut-16.png';

function RibbonClipboard({ ribbonWidth }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  useOutsideClick(dropdownRef, () => isDropdownOpen && setIsDropdownOpen(false));

  const isOnlyContent = ribbonWidth >= 855;
  const showText = ribbonWidth < 855 || ribbonWidth >= 1025; 

  return (
    <RibbonItemContainer isOnlyContent={isOnlyContent} icon={clipboard16} name="Clipboard">
      <RibbonItemExpanded name="Clipboard">

          <div className={css['container']}>
            <BigButtonDuo 
              icon={clipboard32} 
              name="Paste"
              showChildren={isDropdownOpen}
              setShowChildren={setIsDropdownOpen}
              onPointerDownBottom={(e) => e.button === 0 && toggleBoolState(isDropdownOpen, setIsDropdownOpen)}
            >
              <div className="popup" ref={dropdownRef}>
                <button className="popup__button text text--4 text--nowrap">
                  <img className="popup__image" src={clipboard16} alt=""/>
                  <span><span className="text--underline">P</span>aste</span>
                </button>

                <button className="popup__button text text--4 text--nowrap">
                  <img className="popup__image" src={pasteFrom16} alt=""/>
                  <span>Paste <span className="text--underline">f</span>rom</span>
                </button>
              </div>
            </BigButtonDuo>

            <div>
              <button className="button">
                <img draggable="false" src={cut16} alt="Cut."/>
                {showText && <span className="text text--1">Cut</span>}
              </button>

              <button className="button">
                <img draggable="false" src={copy16} alt="Copy."/>
                {showText && <span className="text text--1">Copy</span>}
              </button>
            </div>
          </div>

      </RibbonItemExpanded>

      <div className="vertical-line"></div>
      
    </RibbonItemContainer>
  );
}

RibbonClipboard.propTypes = {
  ribbonWidth: PropTypes.number.isRequired,
};

export default RibbonClipboard;