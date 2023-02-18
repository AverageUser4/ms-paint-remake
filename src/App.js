import React, { useRef } from 'react';

import PaintXPlatform from './components/PaintXPlatform/PaintXPlatform';

function App() {
  const containerRef = useRef();
  
  return (
    <div className="app" ref={containerRef}>
      <PaintXPlatform
        containerRef={containerRef}
        // isConstrained={false}
      />
    </div>
  );
}

export default App;