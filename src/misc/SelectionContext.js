import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useCanvasContext } from './CanvasContext';
import { doGetCanvasCopy } from './utils';

const SelectionContext = createContext();

function SelectionProvider({ children }) {
  const { setCanvasSize, canvasZoom } = useCanvasContext();
  
  const selectionRef = useRef();
  const selectionCtxRef = useRef();
  const [selectionSize, setSelectionSize] = useState(null);
  const [selectionResizedSize, setSelectionResizedSize] = useState(null);
  const [selectionPosition, setSelectionPosition] = useState(null);
  const [selectionOutlineSize, setSelectionOutlineSize] = useState(null);
  const [selectionPhase, setSelectionPhase] = useState(0); // 0, 1 or 2
  const lastSelectionStateRef = useRef();
  const lastSelectionSizeRef = useRef(null);
  const lastSelectionPositionRef = useRef(null);
  const inputFileRef = useRef();

  function doSetSize(newSize) {
    setSelectionSize(newSize);
    setSelectionResizedSize(newSize);
    lastSelectionSizeRef.current = newSize;
  }

  function doSetPosition(newPosition) {
    setSelectionPosition(newPosition);
    lastSelectionPositionRef.current = newPosition;
  }

  function doSelectionDrawToPrimary(primaryContext, zoom) {
    primaryContext.imageSmoothingEnabled = false;
    primaryContext.drawImage(
      doGetCanvasCopy(selectionRef.current),
      Math.round(selectionPosition.x / zoom),
      Math.round(selectionPosition.y / zoom),
      Math.round(selectionResizedSize.width / zoom),
      Math.round(selectionResizedSize.height / zoom),
    );
  }

  function doSelectionDrawToSelection(imageData, zoom) {
    // when zoom < 1, part of the image would get cut if we didn't use bufCanvas
    const bufCanvas = document.createElement('canvas');
    bufCanvas.width = Math.round(9999);
    bufCanvas.height = Math.round(9999);
    bufCanvas.imageSmoothingEnabled = false;
    bufCanvas.getContext('2d').putImageData(imageData, 0, 0);
    
    selectionCtxRef.current.imageSmoothingEnabled = false;
    selectionCtxRef.current.putImageData(imageData, 0, 0);
    lastSelectionStateRef.current = doGetCanvasCopy(selectionRef.current);
    selectionCtxRef.current.clearRect(0, 0, selectionRef.current.width, selectionRef.current.height);

    // scale does not apply to putImageData, so have to use drawImage after copying data
    selectionCtxRef.current.scale(zoom, zoom);
    selectionCtxRef.current.drawImage(bufCanvas, 0, 0);
  }

  function doSelectionCrop() {
    setSelectionPhase(0);
  }

  const onLoadImage = useCallback(event => {
    const image = event.target;
    const { naturalWidth: width, naturalHeight: height } = image;

    setCanvasSize(prev => ({ 
      width: prev.width > width ? prev.width : width,
      height: prev.height > height ? prev.height : height,
    }));
    doSetSize({ 
      width: Math.round(width * canvasZoom),
      height: Math.round(height * canvasZoom),
    });
    doSetPosition({ x: 0, y: 0 });
    setSelectionPhase(2);

    setTimeout(() => {
      selectionCtxRef.current.imageSmoothingEnabled = false;
      selectionCtxRef.current.scale(canvasZoom, canvasZoom);
      selectionCtxRef.current.drawImage(image, 0, 0);
      URL.revokeObjectURL(image.src);
    }, 50);
  }, [canvasZoom, setCanvasSize]);
  
  function selectionBrowseFile() {
    inputFileRef.current.click();
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

        image.addEventListener('load', onLoadImage);
        image.addEventListener('error', () => {
          console.error('de_Should not happen.');
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
        selectionResizedSize, setSelectionResizedSize,
        selectionPosition, setSelectionPosition,
        selectionOutlineSize, setSelectionOutlineSize,
        selectionPhase, setSelectionPhase,
        lastSelectionStateRef,
        lastSelectionSizeRef,
        lastSelectionPositionRef,
        doSetSize,
        doSetPosition,
        selectionRef,
        selectionCtxRef,
        selectionBrowseFile,
        selectionPasteFromClipboard,
        doSelectionDrawToPrimary,
        doSelectionDrawToSelection,
        doSelectionCrop,
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