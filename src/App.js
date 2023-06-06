import React, { useEffect, useState } from 'react';

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
  const [force, setForce] = useState(false);
  useEffect(() => {
    console.log('changing to full size')
    const fullSize = true;
    if(fullSize) {
      document.querySelector('html').classList.add('full');
      setForce(true);
    }
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