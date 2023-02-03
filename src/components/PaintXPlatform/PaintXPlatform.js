import React from 'react';

import CanvasContainer from '../CanvasContainer/CanvasContainer';
import Ribbon from '../Ribbon/Ribbon';
import RibbonControls from '../RibbonControls/RibbonControls';
import TopBar from '../TopBar/TopBar';
import BottomBar from '../BottomBar/BottomBar';

function PaintXPlatform() {
  return (
    <article>
      <TopBar/>
      <RibbonControls/>
      <Ribbon/>
      <CanvasContainer/>
      <BottomBar/>
    </article>
  );
}

export default PaintXPlatform;