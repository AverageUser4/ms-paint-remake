import React from "react";
import PropTypes from 'prop-types';
import css from './RibbonClipboard.module.css';

import RibbonItemDuo from '../RibbonItemDuo/RibbonItemDuo';
import RibbonItemExpanded from "../RibbonItemExpanded/RibbonItemExpanded";
import RibbonItemContainer from "../RibbonItemContainer/RibbonItemContainer";

import clipboard32 from './assets/clipboard-32.png';
import clipboard16 from './assets/clipboard-16.png';
import copy16 from './assets/copy-16.png';
import cut16 from './assets/cut-16.png';

function RibbonClipboard({ ribbonWidth }) {
  const showContent = ribbonWidth >= 855;
  const showText = ribbonWidth < 855 || ribbonWidth >= 1025; 

  return (
    <RibbonItemContainer showContent={showContent} icon={clipboard16} name="Clipboard">
      <RibbonItemExpanded name="Clipboard">

          <div className={css['container']}>
            <RibbonItemDuo icon={clipboard32} name="Paste"/>

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
    </RibbonItemContainer>
  );
}

RibbonClipboard.propTypes = {
  ribbonWidth: PropTypes.number,
};

export default RibbonClipboard;