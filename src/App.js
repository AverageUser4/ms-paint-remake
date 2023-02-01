import React from 'react';
import Ribbon from './components/Ribbon/Ribbon';
import RibbonControls from './components/RibbonControls/RibbonControls';
import TopBar from './components/TopBar/TopBar';

function App() {
  return (
    <div>
      <TopBar/>
      <RibbonControls/>
      <Ribbon/>
    </div>
  );
}

export default App;