import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

import ImageInput from '../components/ImageInput/ImageInput';

import { useCanvasContext } from './CanvasContext';
import { useHistoryContext } from './HistoryContext';
import { useToolContext } from './ToolContext';
import { doGetCanvasCopy, writeCanvasToClipboard, ImageDataUtils } from '../misc/utils';

const SelectionContext = createContext();

function SelectionProvider({ children }) {
  const { 
    setCanvasSize, canvasZoom, canvasSize,
    primaryRef, doCanvasClearPrimary, doGetEveryContext,
  } = useCanvasContext();
  const { doHistoryAdd } = useHistoryContext();
  const { setCurrentTool } = useToolContext();
  
  const [selectionSize, setSelectionSize] = useState(null);
  const [selectionPosition, setSelectionPosition] = useState(null);
  const [selectionOutlineSize, setSelectionOutlineSize] = useState(null);
  const [selectionPhase, setSelectionPhase] = useState(0); // 0, 1 or 2
  const selectionRef = useRef();
  const thumbnailSelectionRef = useRef();
  const inputFileRef = useRef();
  const lastSelectionStateRef = useRef(null);
  const lastSelectionSizeRef = useRef(null);
  const lastSelectionPositionRef = useRef(null);

  useEffect(() => {
    // redraw always when size changes (as the canvas gets cleared when width or height attribute changes)
    if(selectionPhase === 2 && lastSelectionStateRef.current) {
      selectionRef.current.getContext('2d').drawImage(lastSelectionStateRef.current, 0, 0);
    }
  }, [selectionSize, selectionPhase]);

  function doSelectionEnd() {
    setSelectionSize(null);
    setSelectionPosition(null);
    setSelectionOutlineSize(null);
    setSelectionPhase(0);
    lastSelectionStateRef.current = null;
    lastSelectionSizeRef.current = null;
    lastSelectionPositionRef.current = null;
  }
  
  function doSelectionSetSize(newSize) {
    setSelectionSize(newSize);
    lastSelectionSizeRef.current = newSize;
  }

  function doSelectionSetPosition(newPosition) {
    setSelectionPosition(newPosition);
    lastSelectionPositionRef.current = newPosition;
  }

  function doSelectionResize(newSize) {
    const selectionCanvasCopy = doGetCanvasCopy(selectionRef.current);
    const multiplier = {
      x: newSize.width / selectionSize.width,
      y: newSize.height / selectionSize.height,
    };
    
    doSelectionSetSize(newSize);

    setTimeout(() => {
      const { selectionContext, thumbnailSelectionContext } = doSelectionGetEveryContext();

      function drawToContext(context, isThumbnail) {
        context.save();
        context.imageSmoothingEnabled = false;
        context.clearRect(0, 0, newSize.width, newSize.height);
        context.scale(multiplier.x, multiplier.y);
        if(isThumbnail) {
          context.scale(1 / canvasZoom, 1 / canvasZoom);
        }
        context.drawImage(selectionCanvasCopy, 0, 0);
        context.restore();
      }

      drawToContext(selectionContext);
      thumbnailSelectionContext && drawToContext(thumbnailSelectionContext, true);
      
      lastSelectionStateRef.current = selectionRef.current;
    }, 20);
  }

  function doSelectionDrawToPrimary(zoom, adjustedPosition) {
    if(typeof zoom !== 'number') {
      console.error(`This function requires first argument (zoom) to be of type "number", provided: "${zoom}".`);
    }
    // using zoom argument is important as it isn't always canvasZoom
    const { primaryContext, thumbnailPrimaryContext } = doGetEveryContext();

    function draw(context) {
      context.imageSmoothingEnabled = false;
      context.drawImage(
        doGetCanvasCopy(selectionRef.current),
        Math.round((adjustedPosition ? adjustedPosition.x : selectionPosition.x) / zoom),
        Math.round((adjustedPosition ? adjustedPosition.y : selectionPosition.y) / zoom),
        Math.round(selectionSize.width / zoom),
        Math.round(selectionSize.height / zoom),
      );
    }

    draw(primaryContext);
    thumbnailPrimaryContext && draw(thumbnailPrimaryContext);

    doHistoryAdd({ 
      element: primaryRef.current,
      width: canvasSize.width,
      height: canvasSize.height
    });
  }

  function doSelectionDrawToSelection(imageData) {
    // when canvasZoom < 1, part of the image would get cut if we didn't use bufCanvas
    const bufCanvas = document.createElement('canvas');
    bufCanvas.width = imageData.width;
    bufCanvas.height = imageData.height;
    bufCanvas.imageSmoothingEnabled = false;
    bufCanvas.getContext('2d').putImageData(imageData, 0, 0);
    
    const { selectionContext, thumbnailSelectionContext } = doSelectionGetEveryContext();

    function drawToContext(context, isThumbnail) {
      context.save();
      context.imageSmoothingEnabled = false;
      context.clearRect(0, 0, selectionRef.current.width, selectionRef.current.height);
      if(!isThumbnail) {
        context.scale(canvasZoom, canvasZoom);
      }
      context.drawImage(bufCanvas, 0, 0);
      context.restore();
    }

    drawToContext(selectionContext);
    thumbnailSelectionContext && drawToContext(thumbnailSelectionContext, true);
    
    lastSelectionStateRef.current = doGetCanvasCopy(selectionRef.current);
  }

  function doSelectionCrop() {
    if(selectionPhase !== 2) {
      return;
    }

    const newPosition = { x: 0, y: 0 };
    const newSize = {
      width: Math.round(selectionSize.width / canvasZoom),
      height: Math.round(selectionSize.height / canvasZoom),
    };

    doSelectionSetPosition(newPosition);
    setCanvasSize(newSize);

    setTimeout(() => {
      doSelectionEnd();
      doCanvasClearPrimary();
      doSelectionDrawToPrimary(canvasZoom, newPosition);
    }, 20);
  }

  const onLoadImage = useCallback(event => {
    const image = event.target;
    const { naturalWidth: width, naturalHeight: height } = image;
    lastSelectionStateRef.current = null;
    
    setCanvasSize(prev => ({ 
      width: prev.width > width ? prev.width : width,
      height: prev.height > height ? prev.height : height,
    }));
    doSelectionSetSize({ 
      width: Math.round(width * canvasZoom),
      height: Math.round(height * canvasZoom),
    });
    doSelectionSetPosition({ x: 0, y: 0 });
    setSelectionPhase(2);

    setTimeout(() => {
      const { selectionContext, thumbnailSelectionContext } = doSelectionGetEveryContext();

      function drawToContext(context, isThumbnail) {
        context.save();
        context.imageSmoothingEnabled = false;
        if(!isThumbnail) {
          context.scale(canvasZoom, canvasZoom);
        }
        context.drawImage(image, 0, 0);
        context.restore();
      }

      drawToContext(selectionContext);
      thumbnailSelectionContext && drawToContext(thumbnailSelectionContext, true);

      lastSelectionStateRef.current = doGetCanvasCopy(selectionRef.current);
      URL.revokeObjectURL(image.src);
    }, 20);
  }, [canvasZoom, setCanvasSize]);
  
  function doSelectionBrowseFile() {
    if(selectionPhase === 2) {
      doSelectionDrawToPrimary(canvasZoom);
      doSelectionEnd();
    }

    inputFileRef.current.click();
    setCurrentTool('selection-rectangle');
  }

  function doSelectionPasteFromClipboard() {   
    if(selectionPhase === 2) {
      doSelectionDrawToPrimary(canvasZoom);
      doSelectionEnd();
    }

    if(!navigator.clipboard.read) {
      console.error('Reading images from clipboard does not seem to be implemented in your browser.');
      return;
    }
    
    navigator.clipboard
      .read()
      .then(clipboardItemsArray => { 
        const clipboardItem = clipboardItemsArray[0];
        const imageType = clipboardItem.types.find(type => type.startsWith('image/'));
  
        if(!imageType) {
          throw new Error('Clipboard does not seem to contain image.');
        }
        
        return clipboardItemsArray[0].getType(imageType); 
      })
      .then(blob => {
        const image = new Image();
        image.src = URL.createObjectURL(blob);
        setCurrentTool('selection-rectangle');

        image.addEventListener('load', onLoadImage);
        image.addEventListener('error', () => {
          console.error('de_Should not happen (if something was wrong would throw earlier).');
        });
      })
      .catch(error => console.error(error));
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
  
  function doSelectionSelectAll() {
    if(selectionPhase === 2) {
      doSelectionDrawToPrimary(canvasZoom);
    }
    
    setSelectionPhase(2);
    doSelectionSetSize({ width: Math.round(canvasSize.width * canvasZoom), height: Math.round(canvasSize.height * canvasZoom) });
    doSelectionSetPosition({ x: 0, y: 0 });
    lastSelectionStateRef.current = null;
    
    setTimeout(() => {
      const primaryImageData = primaryRef.current.getContext('2d').getImageData(0, 0, canvasSize.width, canvasSize.height);
      doSelectionDrawToSelection(primaryImageData);
      doCanvasClearPrimary();
    }, 20);
  }

  function doSelectionInvertSelection() {
    if(selectionPhase !== 2) {
      return;
    }
    
    const { selectionContext } = doSelectionGetEveryContext();
    const primaryImageData = primaryRef.current.getContext('2d').getImageData(0, 0, canvasSize.width, canvasSize.height);
    let selectionImageData;
    if(canvasZoom === 1) {
      selectionImageData = selectionContext.getImageData(0, 0, selectionSize.width, selectionSize.height);
    } else {
      const copy = document.createElement('canvas');
      const copyContext = copy.getContext('2d');
      copy.width = Math.round(selectionSize.width / canvasZoom);
      copy.height = Math.round(selectionSize.height / canvasZoom);
      copyContext.imageSmoothingEnabled = false;
      copyContext.scale(1 / canvasZoom, 1 / canvasZoom);
      copyContext.drawImage(selectionRef.current, 0, 0);
      selectionImageData = copyContext.getImageData(0, 0, copy.width, copy.height);
    }
    
    doCanvasClearPrimary();
    doSelectionDrawToPrimary(canvasZoom);

    const usedPosition = {
      x: Math.max(Math.round(selectionPosition.x / canvasZoom), 0),
      y: Math.max(Math.round(selectionPosition.y / canvasZoom), 0),
    };
    
    for(
      let y = usedPosition.y;
      y < canvasSize.height && y < Math.round((selectionPosition.y + selectionSize.height) / canvasZoom);
      y++
    ) {
      for(
        let x = usedPosition.x;
        x < canvasSize.width && x < Math.round((selectionPosition.x + selectionSize.width) / canvasZoom);
        x++
      ) {
        if(ImageDataUtils.getColorFromCoords(selectionImageData, x - usedPosition.x, y - usedPosition.y).a > 0) {
          ImageDataUtils.setColorAtCoords(primaryImageData, x, y, { r: 0 , g: 0, b: 0, a: 0 });
        }
      }
    }

    doSelectionSetPosition({ x: 0, y: 0 });
    doSelectionSetSize({ width: Math.round(canvasSize.width * canvasZoom), height: Math.round(canvasSize.height * canvasZoom) });

    setTimeout(() => {
      doSelectionDrawToSelection(primaryImageData);
    }, 20);
  }

  function doSharedDelete() {
    if(selectionPhase === 2) {
      doSelectionEnd();
    } else {
      doCanvasClearPrimary();
      doHistoryAdd({ element: primaryRef.current, ...canvasSize });
    }
  }

  function doSelectionGetEveryContext() {
    return {
      selectionContext: selectionRef.current?.getContext('2d'),
      thumbnailSelectionContext: thumbnailSelectionRef.current?.getContext('2d'),
    };
  }
  
  return (
    <SelectionContext.Provider
      value={{
        selectionSize, setSelectionSize,
        selectionPosition, setSelectionPosition,
        selectionOutlineSize, setSelectionOutlineSize,
        selectionPhase, setSelectionPhase,
        lastSelectionStateRef,
        lastSelectionSizeRef,
        lastSelectionPositionRef,
        doSelectionSetSize,
        doSelectionSetPosition,
        selectionRef,
        thumbnailSelectionRef,
        doSelectionBrowseFile,
        doSelectionPasteFromClipboard,
        doSelectionDrawToPrimary,
        doSelectionDrawToSelection,
        doSelectionCrop,
        doSelectionResize,
        doSharedCut,
        doSharedCopy,
        doSelectionSelectAll,
        doSelectionInvertSelection,
        doSharedDelete,
        doSelectionEnd,
        doSelectionGetEveryContext,
      }}
    >
      <ImageInput
        inputRef={inputFileRef}
        onLoad={onLoadImage}
      />
      {children}
    </SelectionContext.Provider>
  );
}

SelectionProvider.propTypes ={
  children: PropTypes.node.isRequired,
};

function useSelectionContext() {
  return useContext(SelectionContext);
}

export {
  SelectionProvider,
  useSelectionContext,
};