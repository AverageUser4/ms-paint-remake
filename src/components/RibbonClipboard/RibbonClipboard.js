import React from "react";
import css from './RibbonClipboard.module.css';

import RibbonItemDuo from '../RibbonItemDuo/RibbonItemDuo';
import RibbonItemExpanded from "../RibbonItemExpanded/RibbonItemExpanded";
import RibbonItemContainer from "../RibbonItemContainer/RibbonItemContainer";

import clipboard32 from './assets/clipboard-32.png';
import clipboard16 from './assets/clipboard-16.png';
import copy16 from './assets/copy-16.png';
import cut16 from './assets/cut-16.png';

function RibbonClipboard() {
  return (
    <RibbonItemContainer icon={clipboard16} name="Clipboard">
      <RibbonItemExpanded name="Clipboard">

          <div className={css['container']}>
            <RibbonItemDuo icon={clipboard32} name="Paste"/>

            <div>
              <button className="button">
                <img src={cut16} alt="Cut."/>
              </button>

              <button className="button">
                <img src={copy16} alt="Copy."/>
              </button>
            </div>
          </div>

      </RibbonItemExpanded>
    </RibbonItemContainer>
  );
}

export default RibbonClipboard;