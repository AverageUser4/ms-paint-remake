import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

import ImageInput from '../components/ImageInput/ImageInput';

import { useCanvasContext } from './CanvasContext';
import { useHistoryContext } from './HistoryContext';
import { useToolContext } from './ToolContext';
import { useColorContext } from './ColorContext';
import { doGetCanvasCopy, ImageDataUtils } from '../misc/utils';

const SelectionContext = createContext();

function SelectionProvider({ children }) {
  const { 
    setCanvasSize, canvasSize,
    primaryRef, doCanvasClearPrimary, doGetEveryContext,
  } = useCanvasContext();
  const { doHistoryAdd } = useHistoryContext();
  const { setCurrentTool } = useToolContext();
  const { colorData } = useColorContext();
  
  const [selectionSize, setSelectionSize] = useState(null);
  const [selectionPosition, setSelectionPosition] = useState(null);
  const [selectionOutlineSize, setSelectionOutlineSize] = useState(null);
  const [selectionOutlinePosition, setSelectionOutlinePosition] = useState(null);
  const [selectionPhase, setSelectionPhase] = useState(0); // 0, 1 or 2
  const [isSelectionTransparent, setIsSelectionTransparent] = useState(false);
  const selectionRef = useRef();
  const thumbnailSelectionRef = useRef();
  const inputFileRef = useRef();
  const lastSelectionStateRef = useRef(null);
  const lastSelectionSizeRef = useRef(null);
  const lastSelectionPositionRef = useRef(null);

  const doSelectionClear = useCallback(() => {
    const { selectionContext, thumbnailSelectionContext } = doSelectionGetEveryContext();

    function clear(context) {
      context.clearRect(0, 0, selectionSize.width, selectionSize.height);
    }

    clear(selectionContext);
    thumbnailSelectionContext && clear(thumbnailSelectionContext);
  }, [selectionSize]);

  const doSelectionDrawToSelection = useCallback((data) => {
    // using data?.width/height is important so picture does not get cut when canvasZoom < 1
    const element = document.createElement('canvas');
    element.width = data?.width || selectionRef.current.width;
    element.height = data?.height || selectionRef.current.height;
    const elementContext = element.getContext('2d');
    let imageData;

    if(data instanceof ImageData) {
      imageData = data;
      elementContext.putImageData(imageData, 0, 0);
    } else {
      elementContext.drawImage(data, 0, 0);
      imageData = elementContext.getImageData(0, 0, selectionRef.current.width, selectionRef.current.height);
    }

    if(isSelectionTransparent) {
      const newImageData = new ImageData(
        imageData.data,
        imageData.width,
        imageData.height
      );

      ImageDataUtils.makeColorTransparent(newImageData, colorData.secondary);
      elementContext.putImageData(newImageData, 0, 0);
    }

    const { selectionContext, thumbnailSelectionContext } = doSelectionGetEveryContext();

    function drawToContext(context) {
      context.save();
      context.imageSmoothingEnabled = false;
      context.clearRect(0, 0, element.width, element.height);
      context.drawImage(element, 0, 0);
      context.restore();
    }

    drawToContext(selectionContext);
    thumbnailSelectionContext && drawToContext(thumbnailSelectionContext);
    lastSelectionStateRef.current = doGetCanvasCopy(selectionRef.current);
  }, [isSelectionTransparent, colorData.secondary]);

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
    setSelectionOutlinePosition(null);
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

      function drawToContext(context) {
        context.save();
        context.imageSmoothingEnabled = false;
        context.clearRect(0, 0, newSize.width, newSize.height);
        context.scale(multiplier.x, multiplier.y);
        context.drawImage(selectionCanvasCopy, 0, 0);
        context.restore();
      }

      drawToContext(selectionContext);
      thumbnailSelectionContext && drawToContext(thumbnailSelectionContext);
      lastSelectionStateRef.current = selectionRef.current;
    }, 20);
  }

  function doSelectionDrawToPrimary(adjustedPosition) {
    const { primaryContext, thumbnailPrimaryContext } = doGetEveryContext();

    function draw(context) {
      context.imageSmoothingEnabled = false;
      context.drawImage(
        doGetCanvasCopy(selectionRef.current),
        (adjustedPosition ? adjustedPosition.x : selectionPosition.x),
        (adjustedPosition ? adjustedPosition.y : selectionPosition.y),
        selectionSize.width,
        selectionSize.height,
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

  function doSelectionCrop() {
    if(selectionPhase !== 2) {
      return;
    }

    const newPosition = { x: 0, y: 0 };

    doSelectionSetPosition(newPosition);
    setCanvasSize(selectionSize);

    setTimeout(() => {
      doSelectionEnd();
      doCanvasClearPrimary();
      doSelectionDrawToPrimary(newPosition);
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
    doSelectionSetSize({ width, height });
    doSelectionSetPosition({ x: 0, y: 0 });
    setSelectionPhase(2);

    setTimeout(() => {
      doSelectionDrawToSelection(image);
      URL.revokeObjectURL(image.src);
    }, 20);
  }, [setCanvasSize, doSelectionDrawToSelection]);
  
  function doSelectionBrowseFile() {
    if(selectionPhase === 2) {
      doSelectionDrawToPrimary();
      doSelectionEnd();
    }

    inputFileRef.current.click();
    setCurrentTool('selection-rectangle');
  }

  function doSelectionPasteFromClipboard() {   
    if(selectionPhase === 2) {
      doSelectionDrawToPrimary();
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
  
  function doSelectionSelectAll() {
    if(selectionPhase === 2) {
      doSelectionDrawToPrimary();
    }
    
    setCurrentTool('selection-rectangle');
    setSelectionPhase(2);
    doSelectionSetSize({ width: canvasSize.width, height: canvasSize.height });
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
    const selectionImageData = selectionContext.getImageData(0, 0, Math.ceil(selectionSize.width), Math.ceil(selectionSize.height));
    
    doCanvasClearPrimary();
    doSelectionDrawToPrimary();

    console.log(selectionSize, selectionPosition)

    const usedPosition = {
      x: Math.max(Math.floor(selectionPosition.x), 0),
      y: Math.max(Math.floor(selectionPosition.y), 0),
    };
    
    for(
      let y = usedPosition.y;
      y < canvasSize.height && y < Math.floor(selectionPosition.y + selectionSize.height);
      y++
    ) {
      for(
        let x = usedPosition.x;
        x < canvasSize.width && x < Math.floor(selectionPosition.x + selectionSize.width);
        x++
      ) {
        if(ImageDataUtils.getColorFromCoords(selectionImageData, x - usedPosition.x, y - usedPosition.y).a > 0) {
          ImageDataUtils.setColorAtCoords(primaryImageData, x, y, { r: 0 , g: 0, b: 0, a: 0 });
        }
      }
    }

    doSelectionSetPosition({ x: 0, y: 0 });
    doSelectionSetSize({ width: canvasSize.width, height: canvasSize.height });

    setTimeout(() => {
      doSelectionDrawToSelection(primaryImageData);
    }, 20);
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
        selectionOutlinePosition, setSelectionOutlinePosition,
        selectionPhase, setSelectionPhase,
        isSelectionTransparent, setIsSelectionTransparent,
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
        doSelectionSelectAll,
        doSelectionInvertSelection,
        doSelectionEnd,
        doSelectionGetEveryContext,
        doSelectionClear,
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