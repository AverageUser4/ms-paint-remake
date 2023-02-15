import React, { useEffect } from 'react';

import PaintXPlatform from './components/PaintXPlatform/PaintXPlatform';
import { ContextMenuProvider } from './misc/ContextMenuContext';

function App() {
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
    <div className="app">
      <ContextMenuProvider>
        <PaintXPlatform/>
      </ContextMenuProvider>
    </div>
  );
}

export default App;