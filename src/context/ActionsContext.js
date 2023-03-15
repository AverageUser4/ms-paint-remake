import React, { createContext, useContext, useRef } from 'react';
import PropTypes from 'prop-types';

import ImageInput from '../components/ImageInput/ImageInput';

import { useHistoryContext } from './HistoryContext';
import { useCanvasContext } from './CanvasContext';
import { useSelectionContext } from './SelectionContext';
import { useWindowsContext } from './WindowsContext';
import { doGetCanvasCopy } from '../misc/utils';

const ActionsContext = createContext();

function ActionsProvider({ children }) {
  const { doHistoryClear } = useHistoryContext();
  const { 
    doCanvasFullReset, setCanvasSize, primaryRef,
    lastPrimaryStateRef, fileData, isBlackAndWhite,
    doGetEveryContext,
  } = useCanvasContext();
  const { doRequirePromptWindow } = useWindowsContext();
  const { setSelectionPhase } = useSelectionContext();
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
      setSelectionPhase(0);
    });
  }
  
  function doOpenNewFile() {
    doRequirePromptWindow(() => {
      doHistoryClear();
      doCanvasFullReset();
      setSelectionPhase(0);
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
  
  return (
    <ActionsContext.Provider
      value={{
        doStartNewProject,
        doOpenNewFile,
        doSaveFile,
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