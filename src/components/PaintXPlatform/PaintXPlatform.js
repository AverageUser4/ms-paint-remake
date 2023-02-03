import React from 'react';
import css from './PaintXPlatform.module.css';

import Window from '../Window/Window';
import CanvasContainer from '../CanvasContainer/CanvasContainer';
import Ribbon from '../Ribbon/Ribbon';
import RibbonControls from '../RibbonControls/RibbonControls';
import TopBar from '../TopBar/TopBar';
import BottomBar from '../BottomBar/BottomBar';

function PaintXPlatform() {
  return (
    <Window Top={TopBar}>
      <RibbonControls/>
      <Ribbon/>
      <CanvasContainer/>
      <BottomBar/>
    </Window>
  );
}

export default PaintXPlatform;