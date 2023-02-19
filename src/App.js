import React from 'react';

import PaintXPlatform from './components/PaintXPlatform/PaintXPlatform';

function App() {
  return (
    <div className="app">
      <PaintXPlatform
        isConstrained={true}
      />
    </div>
  );
}

export default App;