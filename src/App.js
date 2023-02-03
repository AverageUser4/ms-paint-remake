import React from 'react';

import CanvasContainer from './components/CanvasContainer/CanvasContainer';
import Ribbon from './components/Ribbon/Ribbon';
import RibbonControls from './components/RibbonControls/RibbonControls';
import TopBar from './components/TopBar/TopBar';
import BottomBar from './components/BottomBar/BottomBar';

function App() {
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

export default App;