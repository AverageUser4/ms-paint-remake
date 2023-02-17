import React, { useEffect, useRef } from 'react';

import PaintXPlatform from './components/PaintXPlatform/PaintXPlatform';

function App() {
  const containerRef = useRef();
  /* TEMPORARY */
  /* TEMPORARY */
  /* TEMPORARY */
  /* TEMPORARY */
  useEffect(() => {
    document.body.style.overflow = 'hidden';
  }, []);
  /* TEMPORARY */
  /* TEMPORARY */
  /* TEMPORARY */
  /* TEMPORARY */
  
  return (
    <div className="app" ref={containerRef}>
      <PaintXPlatform
        containerRef={containerRef}
        minimalSize={{ width: 1, height: 1 }}
      />
    </div>
  );
}

export default App;