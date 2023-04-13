import React, { createContext, useContext, useRef } from 'react';
import PropTypes from 'prop-types';

import ImageInput from '../components/ImageInput/ImageInput';

import { useHistoryContext } from './HistoryContext';
import { useCanvasContext } from './CanvasContext';
import { useSelectionContext } from './SelectionContext';
import { useWindowsContext } from './WindowsContext';
import { useToolContext } from './ToolContext';
import { getCanvasCopy, writeCanvasToClipboard, degreesToRadians, ImageDataUtils } from '../misc/utils';
import { zoomData } from '../misc/data';

const ActionsContext = createContext();

function ActionsProvider({ children }) {
  const { 
    doHistoryClear, doHistoryAdd, isHistoryOnFirst,
    isHistoryOnLast, history, setHistory
  } = useHistoryContext();
  const { 
    setCanvasSize, primaryRef, lastPrimaryStateRef,
    fileData, isBlackAndWhite, doGetEveryContext,
    canvasZoom, setCanvasZoom, doCanvasClearPrimary,
    setFileData, canvasSize, doCanvasDrawImageToPrimary
  } = useCanvasContext();
  const { doRequirePromptWindow } = useWindowsContext();
  const { 
    doSelectionEnd, selectionPhase, doSelectionDrawToPrimary,
    selectionRef, selectionSize, doSelectionSetSize, lastSelectionStateRef,
    doSelectionClear, doSelectionGetEveryContext,
  } = useSelectionContext();
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
      
      lastPrimaryStateRef.current = getCanvasCopy(primaryRef.current);
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
      doSelectionDrawToPrimary();
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
      doSelectionDrawToPrimary();
    }
    doSelectionEnd();

    if(currentTool.startsWith('brushes')) {
      setLatestTools(prev => ({ ...prev, brushes: currentTool }));
    } else if(currentTool.startsWith('selection')) {
      setLatestTools(prev => ({ ...prev, selection: currentTool }));
    }
    setCurrentTool(tool);
  }

  function doSharedCut() {
    if(selectionPhase === 2) {
      writeCanvasToClipboard(selectionRef.current);
      doSelectionEnd();
    } else {
      writeCanvasToClipboard(primaryRef.current);
      doCanvasClearPrimary();
      doHistoryAdd({ element: primaryRef.current, ...canvasSize });
    }
  }

  function doSharedCopy() {
    if(selectionPhase === 2) {
      writeCanvasToClipboard(selectionRef.current);
    } else {
      writeCanvasToClipboard(primaryRef.current);
    }
  }

  function doSharedDelete() {
    if(selectionPhase === 2) {
      doSelectionEnd();
    } else {
      doCanvasClearPrimary();
      doHistoryAdd({ element: primaryRef.current, ...canvasSize });
    }
  }

  function doSharedRotate(degree) {
    if(degree !== 180 && degree !== 90 && degree !== -90) {
      console.error(`de_Unexpected degree: "${degree}".`);
    }

    const { selectionContext, thumbnailSelectionContext } = doSelectionGetEveryContext();
    const { primaryContext, thumbnailPrimaryContext } = doGetEveryContext();

    let usedRef = primaryRef;
    let usedContext = primaryContext;
    let usedThumbnailContext = thumbnailPrimaryContext;
    let usedSize = canvasSize;
    let usedSetSize = setCanvasSize;
    let usedLastStateRef = lastPrimaryStateRef;
    let usedCopy = getCanvasCopy(primaryRef.current);
    let usedClear = doCanvasClearPrimary;
    let offset = 0;

    if(selectionPhase === 2) {
      usedRef = selectionRef;
      usedContext = selectionContext;
      usedThumbnailContext = thumbnailSelectionContext;
      usedSize = selectionSize;
      usedSetSize = doSelectionSetSize;
      usedLastStateRef = lastSelectionStateRef;
      usedCopy = getCanvasCopy(selectionRef.current);
      usedClear = doSelectionClear;
    }

    if(degree === 90 || degree === -90) {
      usedSetSize({ width: usedSize.height, height: usedSize.width });
      offset = (usedSize.width - usedSize.height) / 2;
      if(degree < 0) {
        offset *= -1;
      }
      usedLastStateRef.current = null;
    }

    usedClear();

    setTimeout(() => {
      function rotateAndDraw(context) {
        context.save();
        context.translate(usedSize.width / 2, usedSize.height / 2);
        context.rotate(degreesToRadians(degree));
        context.translate(-usedSize.width / 2, -usedSize.height / 2);
        context.drawImage(usedCopy, offset, offset);
        context.restore();
      }

      rotateAndDraw(usedContext);
      usedThumbnailContext && rotateAndDraw(usedThumbnailContext);
      usedLastStateRef.current = getCanvasCopy(usedRef.current);

      if(selectionPhase !== 2) {
        doHistoryAdd({ 
          element: primaryRef.current,
          width: primaryRef.current.width,
          height: primaryRef.current.height,
        });
      }
    }, 20);
  }

  function doSharedFlip(direction) {
    if(direction !== 'horizontal' && direction !== 'vertical') {
      console.error(`Unexpected direction: "${direction}".`);
    }

    const { selectionContext, thumbnailSelectionContext } = doSelectionGetEveryContext();
    const { primaryContext, thumbnailPrimaryContext } = doGetEveryContext();

    let usedRef = primaryRef;
    let usedContext = primaryContext;
    let usedThumbnailContext = thumbnailPrimaryContext;
    let usedSize = canvasSize;
    let usedLastStateRef = lastPrimaryStateRef;
    let usedClear = doCanvasClearPrimary;
    let usedCopy = getCanvasCopy(primaryRef.current);

    if(selectionPhase === 2) {
      usedRef = selectionRef;
      usedContext = selectionContext;
      usedThumbnailContext = thumbnailSelectionContext;
      usedSize = selectionSize;
      usedLastStateRef = lastSelectionStateRef;
      usedClear = doSelectionClear;
      usedCopy = getCanvasCopy(selectionRef.current);
    }

    usedClear();

    function flipAndDraw(context) {
      context.save();
      context.scale(direction === 'horizontal' ? -1 : 1, direction === 'vertical' ? -1 : 1);
      context.drawImage(
        usedCopy, 
        direction === 'horizontal' ? -usedSize.width : 0,
        direction === 'vertical' ? -usedSize.height : 0
      );
      context.restore();
    }

    flipAndDraw(usedContext);
    usedThumbnailContext && flipAndDraw(usedThumbnailContext, true);
    usedLastStateRef.current = getCanvasCopy(usedRef.current);

    if(selectionPhase !== 2) {
      doHistoryAdd({ 
        element: primaryRef.current,
        width: primaryRef.current.width,
        height: primaryRef.current.height,
      });
    }
  }

  function doSharedInvertColor() {
    let usedImageData;
    const { selectionContext, thumbnailSelectionContext } = doSelectionGetEveryContext();
    const { primaryContext, thumbnailPrimaryContext } = doGetEveryContext();

    if(selectionPhase === 2) {
      usedImageData = selectionContext.getImageData(0, 0, selectionSize.width, selectionSize.height);
    } else {
      usedImageData = primaryContext.getImageData(0, 0, canvasSize.width, canvasSize.height);
    }

    for(let y = 0; y < usedImageData.height; y++) {
      for(let x = 0; x < usedImageData.width; x++) {
        const color = ImageDataUtils.getColorFromCoords(usedImageData, x, y);
        if(color.a > 0) {
          ImageDataUtils.setColorAtCoords(usedImageData, x, y, { 
            r: 255 - color.r, g: 255 - color.g, b: 255 - color.b, a: color.a
          });
        }
      }
    }

    if(selectionPhase === 2) {
      // this is different than doSelectionDrawToSelection
      selectionContext.putImageData(usedImageData, 0, 0);
      if(thumbnailSelectionContext) {
        thumbnailSelectionContext.drawImage(selectionRef.current, 0, 0);
      }
      lastSelectionStateRef.current = getCanvasCopy(selectionRef.current);
    } else {
      primaryContext.putImageData(usedImageData, 0, 0);
      thumbnailPrimaryContext?.putImageData(usedImageData, 0, 0);
      doHistoryAdd({ element: primaryRef.current, ...canvasSize });
    }
  }

  function doHistorySetToState(index) {
    const data = history.dataArray[index];
    const bufCanvas = document.createElement('canvas');
    bufCanvas.width = data.width;
    bufCanvas.height = data.height;
    bufCanvas.getContext('2d').drawImage(data.element, 0, 0);
  
    doCanvasClearPrimary({ ...data });
    doCanvasDrawImageToPrimary(bufCanvas);
    lastPrimaryStateRef.current = getCanvasCopy(bufCanvas);
  
    setCanvasSize({ width: data.width, height: data.height });
    setHistory(prev => ({ ...prev, currentIndex: index }));
  }
  
  function doHistoryGoBack() {
    if(selectionPhase === 2) {
      doSelectionEnd();
      return;
    }

    if(!isHistoryOnFirst) {
      doHistorySetToState(history.currentIndex - 1);
    }
  }

  function doHistoryGoForward() {
    if(selectionPhase === 2) {
      doSelectionDrawToPrimary();
      doSelectionEnd();
      return;
    }

    if(!isHistoryOnLast) {
      doHistorySetToState(history.currentIndex + 1);
    }
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
        doSharedCut,
        doSharedCopy,
        doSharedDelete,
        doSharedRotate,
        doSharedFlip,
        doSharedInvertColor,
        doHistorySetToState,
        doHistoryGoBack,
        doHistoryGoForward,
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