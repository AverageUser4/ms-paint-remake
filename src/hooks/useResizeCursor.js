import { useState, useEffect } from 'react';

function useResizeCursor(resizeData) {
  const [ID] = useState(Math.random());
  const [styleSheet] = useState(new CSSStyleSheet);
  
  useEffect(() => {
    styleSheet._ID = ID;    
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, styleSheet];

    return () => {
      document.adoptedStyleSheets = document.adoptedStyleSheets.filter(ss => ss._ID !== ID);
    };
  }, [styleSheet, ID]);
  
  useEffect(() => {
    if(!resizeData) {
      if(styleSheet.cssRules.length)
        styleSheet.deleteRule(0);
      return;
    }

    let newCursor;
      
    switch(resizeData.type) {
      case 'left':
      case 'right':
        newCursor = 'ew-resize';
        break;

      case 'top':
      case 'bottom':
        newCursor = 'ns-resize';
        break;

      case 'top-right':
      case 'bottom-left':
        newCursor = 'ne-resize';
        break;

      case 'top-left':
      case 'bottom-right':
        newCursor = 'nw-resize';
        break;

      default:
        console.error(`Unrecognized "resizeData.type": "${resizeData.type}".`);
    }

    if(!styleSheet.cssRules.length)
      styleSheet.insertRule(`* { cursor: ${newCursor} !important; }`);

    return () => {
      if(styleSheet.cssRules.length)
        styleSheet.deleteRule(0);
    };
  }, [resizeData, styleSheet]);
}

export default useResizeCursor;