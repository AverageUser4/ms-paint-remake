import React, { useEffect } from 'react';

import PaintXPlatform from './components/PaintXPlatform/PaintXPlatform';

function App() {
  /* TEMP */
  /* TEMP */
  /* TEMP */
  /* TEMP */
  /* TEMP */
  /* TEMP */
  /* TEMP */
  /* TEMP */
  useEffect(() => {
    const fullSize = true;
    if(fullSize)
      document.querySelector('html').classList.add('full');
  }, []);
  /* TEMP */
  /* TEMP */
  /* TEMP */
  /* TEMP */
  /* TEMP */
  /* TEMP */
  /* TEMP */
  /* TEMP */
  /* TEMP */

  
  return (
    <div className="app">
      <PaintXPlatform
        isConstrained={true}
      />
    </div>
  );
}

export default App;