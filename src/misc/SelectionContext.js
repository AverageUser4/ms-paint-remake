import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useCanvasContext } from './CanvasContext';
import { useHistoryContext } from './HistoryContext';
import { useToolContext } from './ToolContext';
import { doGetCanvasCopy } from './utils';

const SelectionContext = createContext();

function SelectionProvider({ children }) {
  const { setCanvasSize, canvasZoom, canvasSize, primaryRef, lastPrimaryStateRef, clearPrimary } = useCanvasContext();
  const { doHistoryAdd } = useHistoryContext();
  const { setCurrentTool } = useToolContext();
  
  const [selectionSize, setSelectionSize] = useState(null);
  const [selectionPosition, setSelectionPosition] = useState(null);
  const [selectionOutlineSize, setSelectionOutlineSize] = useState(null);
  const [selectionPhase, setSelectionPhase] = useState(0); // 0, 1 or 2
  const selectionRef = useRef();
  const inputFileRef = useRef();
  const lastSelectionStateRef = useRef(null);
  const lastSelectionSizeRef = useRef(null);
  const lastSelectionPositionRef = useRef(null);

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
      const selectionContext = selectionRef.current.getContext('2d');
      selectionContext.save();
      selectionContext.imageSmoothingEnabled = false;
      selectionContext.clearRect(0, 0, newSize.width, newSize.height);
      selectionContext.scale(multiplier.x, multiplier.y);
      selectionContext.drawImage(selectionCanvasCopy, 0, 0);
      lastSelectionStateRef.current = selectionRef.current;
      selectionContext.restore();
    }, 20);
  }

  function doSelectionDrawToPrimary(zoom, adjustedPosition) {
    // using zoom argument is important as it isn't always canvasZoom
    const primaryContext = primaryRef.current.getContext('2d');
    primaryContext.imageSmoothingEnabled = false;
    primaryContext.drawImage(
      doGetCanvasCopy(selectionRef.current),
      Math.round((adjustedPosition ? adjustedPosition.x : selectionPosition.x) / zoom),
      Math.round((adjustedPosition ? adjustedPosition.y : selectionPosition.y) / zoom),
      Math.round(selectionSize.width / zoom),
      Math.round(selectionSize.height / zoom),
    );

    lastPrimaryStateRef.current = doGetCanvasCopy(primaryRef.current);

    doHistoryAdd({ 
      element: doGetCanvasCopy(primaryRef.current),
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
    
    const selectionContext = selectionRef.current.getContext('2d');
    selectionContext.save();
    selectionContext.imageSmoothingEnabled = false;
    selectionContext.clearRect(0, 0, selectionRef.current.width, selectionRef.current.height);
    // scale does not apply to putImageData, so have to use drawImage after copying data
    selectionContext.scale(canvasZoom, canvasZoom);
    selectionContext.drawImage(bufCanvas, 0, 0);
    lastSelectionStateRef.current = doGetCanvasCopy(selectionRef.current);
    selectionContext.restore();
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
      setSelectionPhase(0);
      clearPrimary();
      doSelectionDrawToPrimary(canvasZoom, newPosition);
    }, 20);
  }

  const onLoadImage = useCallback(event => {
    const image = event.target;
    const { naturalWidth: width, naturalHeight: height } = image;

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
      const selectionContext = selectionRef.current.getContext('2d');
      selectionContext.save();
      selectionContext.imageSmoothingEnabled = false;
      selectionContext.scale(canvasZoom, canvasZoom);
      selectionContext.drawImage(image, 0, 0);
      lastSelectionStateRef.current = doGetCanvasCopy(selectionRef.current);
      selectionContext.restore();
      URL.revokeObjectURL(image.src);
    }, 20);
  }, [canvasZoom, setCanvasSize]);
  
  function selectionBrowseFile() {
    inputFileRef.current.click();
    setCurrentTool('selection-rectangle');
  }

  function selectionPasteFromClipboard() {
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

  useEffect(() => {
    function onChange() {
      const image = new Image();
      image.src = URL.createObjectURL(inputFileRef.current.files[0]);

      image.addEventListener('load', onLoadImage);

      image.addEventListener('error', () => {
        console.error('de_Provided file does not appear to be an image.');
      });
    }

    const inputFileElement = inputFileRef.current;
    
    inputFileElement.addEventListener('change', onChange);

    return () => {
      inputFileElement.removeEventListener('change', onChange);
    };
  }, [setCanvasSize, canvasZoom, onLoadImage]);
  
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
        selectionBrowseFile,
        selectionPasteFromClipboard,
        doSelectionDrawToPrimary,
        doSelectionDrawToSelection,
        doSelectionCrop,
        doSelectionResize,
      }}
    >
      <input 
        type="file"
        ref={inputFileRef}
        style={{ display: 'none' }}
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