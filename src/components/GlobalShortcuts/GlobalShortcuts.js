import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { useMainWindowContext } from '../../context/MainWindowContext';
import { useSelectionContext } from '../../context/SelectionContext';
import { useHistoryContext } from '../../context/HistoryContext';
import { useWindowsContext } from '../../context/WindowsContext';
import { useActionsContext } from '../../context/ActionsContext';
import { useCanvasContext } from '../../context/CanvasContext';
import { useToolContext } from '../../context/ToolContext';

function GlobalShortcuts({ ribbonData }) {
  // https://www.guidingtech.com/15171/ms-microsoft-paint-keyboard-shortcuts/
  const { isMainWindowFocused } = useMainWindowContext();
  const { 
    doSelectionSelectAll, doSharedCopy, doSharedCut,
    doSelectionPasteFromClipboard, doSharedDelete,
    doSelectionDrawToPrimary, doSelectionEnd, selectionPhase,
  } = useSelectionContext();
  const { doHistoryGoBack, doHistoryGoForward } = useHistoryContext();
  const { 
    setIsPropertiesWindowOpen, setIsGridLinesVisible, setIsRulersVisible,
    setIsResizeWindowOpen,
  } = useWindowsContext();
  const {
    doStartNewProject, doOpenNewFile, doSaveFile, doCanvasChangeZoom
  } = useActionsContext();
  const { setIsFullScreenView, canvasZoom } = useCanvasContext();
  const { currentToolData, doCurrentToolSetSize } = useToolContext();

  useEffect(() => {
    function onKeyDown(event) {
      event.preventDefault();
      
      if(event.ctrlKey) {
        switch(event.key.toLowerCase()) {
          case 'a':
            doSelectionSelectAll();
            break;

          case 'c':
            doSharedCopy();
            break;

          case 'x':
            doSharedCut();
            break;

          case 'v':
            doSelectionPasteFromClipboard();
            break;

          case 'z':
            doHistoryGoBack();
            break;

          case 'y':
            doHistoryGoForward();
            break;

          case 'e':
            setIsPropertiesWindowOpen(true);
            break;

          case 'g':
            setIsGridLinesVisible(prev => !prev);
            break;

          case 'r':
            setIsRulersVisible(prev => !prev);
            break;

          case 'w':
            setIsResizeWindowOpen(true);
            break;

          case 'n':
            doStartNewProject();
            break;

          case 'o':
            doOpenNewFile();
            break;

          case 's':
            doSaveFile();
            break;

          case 'pageup':
            doCanvasChangeZoom();
            break;

          case 'pagedown':
            doCanvasChangeZoom(false);
            break;

          case 'f1':
            ribbonData.toggleMinimize();
            break;

          case '+':
            doCurrentToolSetSize(currentToolData.chosenSize + 1);
            break;

          case '-':
            doCurrentToolSetSize(currentToolData.chosenSize - 1);
            break;
        }
      } else if(event.altKey) {
        switch(event.key.toLowerCase()) {
          case 'h':
            ribbonData.setTab('home');
            break;

          case 'v':
            ribbonData.setTab('view');
            break;
        }
      } else {
        switch(event.key.toLowerCase()) {
          case 'f1':
            document.querySelector('#pxp-help-link').click();
            break;

          case 'f11':
            setIsFullScreenView(prev => !prev);
            break;

          case 'f12':
            doSaveFile();
            break;

          case 'delete':
            doSharedDelete();
            break;

          case 'escape':
            if(selectionPhase === 2) {
              doSelectionDrawToPrimary(canvasZoom);
              doSelectionEnd();
            }
            break;
        }
      }
    }

    function onWheel(event) {
      if(event.ctrlKey) {
        event.preventDefault();
        doCanvasChangeZoom(event.deltaY > 0);
      }
    }

    if(isMainWindowFocused) {
      window.addEventListener('keydown', onKeyDown);
      window.addEventListener('wheel', onWheel, { passive: false });
    }

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('wheel', onWheel, { passive: false });
    };
  });
  
  return null;
}

GlobalShortcuts.propTypes = {
  ribbonData: PropTypes.object.isRequired,
}

export default GlobalShortcuts;