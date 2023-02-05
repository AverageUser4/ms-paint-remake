import React, { useState } from 'react';
import css from './PaintXPlatform.module.css';

import Window from '../Window/Window';
import CanvasContainer from '../CanvasContainer/CanvasContainer';
import Ribbon from '../Ribbon/Ribbon';
import RibbonControls from '../RibbonControls/RibbonControls';
import TopBar from '../TopBar/TopBar';
import BottomBar from '../BottomBar/BottomBar';

function PaintXPlatform() {
  const [activeRibbonTab, setActiveRibbonTab] = useState('home');

  return (
    <Window
      items={[
        { Component: TopBar, props: {} },
        { Component: RibbonControls, props: { activeRibbonTab, setActiveRibbonTab } },
        { Component: Ribbon, props: { activeRibbonTab } },
        { Component: CanvasContainer, props: {} },
        { Component: BottomBar, props: {} }
      ]}
    />
  );
}

export default PaintXPlatform;