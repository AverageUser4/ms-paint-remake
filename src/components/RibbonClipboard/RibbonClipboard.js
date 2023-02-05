import React from "react";
import css from './RibbonClipboard.module.css';

import RibbonItemDuo from '../RibbonItemDuo/RibbonItemDuo';
import RibbonItemExpanded from "../RibbonItemExpanded/RibbonItemExpanded";
import RibbonItemContainer from "../RibbonItemContainer/RibbonItemContainer";

import useItemVisibility from "../../hooks/useItemVisibility";

import clipboard32 from './assets/clipboard-32.png';
import clipboard16 from './assets/clipboard-16.png';
import copy16 from './assets/copy-16.png';
import cut16 from './assets/cut-16.png';

function RibbonClipboard({ ribbonWidth }) {
  return (
    <RibbonItemContainer ribbonWidth={ribbonWidth} icon={clipboard16} name="Clipboard">
      <RibbonItemExpanded name="Clipboard">

          <div className={css['container']}>
            <RibbonItemDuo icon={clipboard32} name="Paste"/>

            <div>
              <button className="button">
                <img draggable="false" src={cut16} alt="Cut."/>
              </button>

              <button className="button">
                <img draggable="false" src={copy16} alt="Copy."/>
              </button>
            </div>
          </div>

      </RibbonItemExpanded>
    </RibbonItemContainer>
  );
}

export default RibbonClipboard;