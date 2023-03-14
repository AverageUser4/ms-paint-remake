import React, { memo, useRef, useState } from "react";
import PropTypes from 'prop-types';
import css from './RibbonClipboard.module.css';

import BigButtonDuo from '../BigButtonDuo/BigButtonDuo';
import RibbonItemExpanded from "../RibbonItemExpanded/RibbonItemExpanded";
import RibbonItemContainer from "../RibbonItemContainer/RibbonItemContainer";
import Tooltip from "../Tooltip/Tooltip";

import useOutsideClick from "../../hooks/useOutsideClick";
import { useSelectionContext } from "../../context/SelectionContext";
import { toggleBoolState } from "../../misc/utils";

import clipboard32 from './assets/clipboard-32.png';
import pasteFrom16 from './assets/paste-from-16.png';
import clipboard16 from '../../assets/global/clipboard-16.png';
import copy16 from '../../assets/global/copy-16.png';
import cut16 from '../../assets/global/cut-16.png';

const RibbonClipboard = memo(function RibbonClipboard({ ribbonWidth }) {
  const { selectionBrowseFile, selectionPasteFromClipboard, doSharedCut, doSharedCopy } = useSelectionContext();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  useOutsideClick(dropdownRef, () => isDropdownOpen && setIsDropdownOpen(false));

  const isOnlyContent = ribbonWidth >= 855;
  const showText = ribbonWidth < 855 || ribbonWidth >= 1025; 

  return (
    <RibbonItemContainer isOnlyContent={isOnlyContent} icon={clipboard16} name="Clipboard">
      <RibbonItemExpanded name="Clipboard">

          <div 
            className={css['container']}
            data-cy="Clipboard"
          >
            <BigButtonDuo 
              icon={clipboard32} 
              name="Paste"
              showChildren={isDropdownOpen}
              setShowChildren={setIsDropdownOpen}
              onPointerDownBottom={(e) => e.button === 0 && toggleBoolState(isDropdownOpen, setIsDropdownOpen)}
              onPointerDownTop={() => selectionPasteFromClipboard()}
              describedByTop="id-clipboard-bbd-top"
              tooltipTop={
                <Tooltip
                ID="id-clipboard-bbd-top"
                heading="Paste (Ctrl+V)"
                text="Paste the contents of the Clipboard."
                />
              }
              describedByBottom="id-clipboard-bbd-bottom"
              tooltipBottom={
                <Tooltip
                  ID="id-clipboard-bbd-bottom"
                  heading="Paste (Ctrl+V)"
                  text="Click here for more options, such as pasting contents from the Clipboard or from a file."
                />
              }
            >
              <div 
                className="popup"
                ref={dropdownRef}
                data-cy="Clipboard-Paste-Dropdown"
              >
                <div className="popup__part">
                  <button 
                    className="tooltip-container popup__button text text--4 text--nowrap"
                    onPointerDown={() => {
                      selectionPasteFromClipboard();
                      setIsDropdownOpen(false);
                    }}
                    aria-describedby="id-clipboard-paste"
                  >
                    <img className="popup__image" src={clipboard16} alt=""/>
                    <span><span className="text--underline">P</span>aste</span>
                    <Tooltip
                      ID="id-clipboard-paste"
                      heading="Paste (Ctrl+V)"
                      text="Paste the contents of the Clipboard."
                    />
                  </button>

                  <button 
                    className="tooltip-container popup__button text text--4 text--nowrap"
                    onPointerDown={() => {
                      selectionBrowseFile();
                      setIsDropdownOpen(false);
                    }}
                    aria-describedby="id-clipboard-paste-from"
                  >
                    <img className="popup__image" src={pasteFrom16} alt=""/>
                    <span>Paste <span className="text--underline">f</span>rom</span>
                    <Tooltip
                      ID="id-clipboard-paste-from"
                      text="Show the Paste From dialog box and pick a file to paste."
                    />
                  </button>
                </div>
              </div>
            </BigButtonDuo>

            <div data-cy="Clipboard-buttons">
              <button 
                className="tooltip-container button"
                onClick={() => {
                  doSharedCut();
                  setIsDropdownOpen(false);
                }}
                aria-describedby="id-clipboard-cut"
              >
                <img draggable="false" src={cut16} alt="Cut."/>
                {showText && <span className="text text--1">Cut</span>}
                <Tooltip
                  ID="id-clipboard-cut"
                  heading="Cut (Ctrl+X)"
                  text="Cut the selection from the canvas and put it on the Clipboard."
                />
              </button>

              <button 
                className="tooltip-container button"
                onClick={() => {
                  doSharedCopy();
                  setIsDropdownOpen(false);
                }}
                aria-describedby="id-clipboard-copy"
              >
                <img draggable="false" src={copy16} alt="Copy."/>
                {showText && <span className="text text--1">Copy</span>}
                <Tooltip
                  ID="id-clipboard-copy"
                  heading="Copy (Ctrl+C)"
                  text="Copy the selection from the canvas and put it on the Clipboard."
                />
              </button>
            </div>
          </div>

      </RibbonItemExpanded>

      <div className="vertical-line"></div>
      
    </RibbonItemContainer>
  );
});

RibbonClipboard.propTypes = {
  ribbonWidth: PropTypes.number.isRequired,
};

export default RibbonClipboard;