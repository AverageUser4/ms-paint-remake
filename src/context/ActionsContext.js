import React, { createContext, useContext, useRef } from 'react';
import PropTypes from 'prop-types';

import ImageInput from '../components/ImageInput/ImageInput';

import { useHistoryContext } from './HistoryContext';
import { useCanvasContext } from './CanvasContext';
import { useSelectionContext } from './SelectionContext';
import { useWindowsContext } from './WindowsContext';
import { useToolContext } from './ToolContext';
import { doGetCanvasCopy } from '../misc/utils';
import { zoomData } from '../misc/data';

const ActionsContext = createContext();

function ActionsProvider({ children }) {
  const { doHistoryClear } = useHistoryContext();
  const { 
    setCanvasSize, primaryRef, lastPrimaryStateRef,
    fileData, isBlackAndWhite, doGetEveryContext,
    canvasZoom, setCanvasZoom, doCanvasClearPrimary,
    setFileData,
  } = useCanvasContext();
  const { doRequirePromptWindow } = useWindowsContext();
  const { doSelectionEnd, selectionPhase, doSelectionDrawToPrimary } = useSelectionContext();
  const { currentTool, setCurrentTool, setLatestTools } = useToolContext();
  const inputFileRef = useRef();
  
  function onLoadImage(event) {
    const image = event.target;
    const { naturalWidth: width, naturalHeight: height } = image;

    setCanvasSize({ width, height });
    
    setTimeout(() => {
      const { primaryContext, thumbnailPrimaryContext } = doGetEveryContext();

      function draw(context) {
        context.imageSmoothingEnabled = false;
        context.drawImage(image, 0, 0);
      }

      draw(primaryContext);
      thumbnailPrimaryContext && draw(thumbnailPrimaryContext);
      
      lastPrimaryStateRef.current = doGetCanvasCopy(primaryRef.current);
      URL.revokeObjectURL(image.src);
    }, 20);
  }

  function doStartNewProject() {
    doRequirePromptWindow(() => {
      doHistoryClear();
      doCanvasFullReset();
      doSelectionEnd();
    });
  }
  
  function doOpenNewFile() {
    doRequirePromptWindow(() => {
      doHistoryClear();
      doCanvasFullReset();
      doSelectionEnd();
      inputFileRef.current.click();
    });
  }
  
  function doSaveFile(mimeType = fileData?.type) {
    let usedCanvas = primaryRef.current;

    if(isBlackAndWhite) {
      usedCanvas = document.createElement('canvas')
      const context = usedCanvas.getContext('2d');
      usedCanvas.width = primaryRef.current.width;
      usedCanvas.height = primaryRef.current.height;
      context.filter = 'grayscale(100%)';
      context.drawImage(primaryRef.current, 0, 0);
    }
    
    const link = document.createElement('a');
    link.href = usedCanvas.toDataURL(mimeType)
    link.download = fileData?.name || 'untitled';
    link.click();
  }

  function doCanvasSetZoom(newZoom) {
    if(selectionPhase === 2) {
      doSelectionDrawToPrimary(canvasZoom);
    }
    doSelectionEnd();
    setCanvasZoom(newZoom);
  }
  
  function doCanvasChangeZoom(decrease) {
    const currentIndex = zoomData.findIndex(data => data.multiplier === canvasZoom); 
    const newIndex = currentIndex + (decrease ? -1 : 1);

    if(newIndex < 0 || newIndex >= zoomData.length) {
      return;
    }

    doCanvasSetZoom(zoomData[newIndex].multiplier);
  }

  function doCanvasFullReset() {
    doCanvasClearPrimary();
    setCanvasZoom(1);
    setFileData(null);
    lastPrimaryStateRef.current = null;
  }

  function doSetCurrentTool(tool) {
    if(selectionPhase === 2) {
      doSelectionDrawToPrimary(canvasZoom);
    }
    doSelectionEnd();

    if(currentTool.startsWith('brushes')) {
      setLatestTools(prev => ({ ...prev, brushes: currentTool }));
    } else if(currentTool.startsWith('selection')) {
      setLatestTools(prev => ({ ...prev, selection: currentTool }));
    }
    setCurrentTool(tool);
  }
  
  return (
    <ActionsContext.Provider
      value={{
        doStartNewProject,
        doOpenNewFile,
        doSaveFile,
        doCanvasSetZoom,
        doCanvasChangeZoom,
        doCanvasFullReset,
        doSetCurrentTool,
      }}
    >
      {children}
      <ImageInput
        inputRef={inputFileRef}
        onLoad={onLoadImage}
        isSetFileData={true}
      />
    </ActionsContext.Provider>
  );
}

ActionsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

function useActionsContext() {
  return useContext(ActionsContext);
}

export {
  ActionsProvider,
  useActionsContext
};