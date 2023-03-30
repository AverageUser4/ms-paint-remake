import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

import ImageInput from '../components/ImageInput/ImageInput';

import { useCanvasContext } from './CanvasContext';
import { useHistoryContext } from './HistoryContext';
import { useToolContext } from './ToolContext';
import { useColorContext } from './ColorContext';
import { doGetCanvasCopy, writeCanvasToClipboard, ImageDataUtils, degreesToRadians } from '../misc/utils';

const SelectionContext = createContext();

function SelectionProvider({ children }) {
  const { 
    setCanvasSize, canvasZoom, canvasSize,
    primaryRef, doCanvasClearPrimary, doGetEveryContext,
    lastPrimaryStateRef,
  } = useCanvasContext();
  const { doHistoryAdd } = useHistoryContext();
  const { setCurrentTool } = useToolContext();
  const { colorData } = useColorContext();
  
  const [selectionSize, setSelectionSize] = useState(null);
  const [selectionPosition, setSelectionPosition] = useState(null);
  const [selectionOutlineSize, setSelectionOutlineSize] = useState(null);
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

    function drawToContext(context, isThumbnail) {
      context.save();
      context.imageSmoothingEnabled = false;
      context.clearRect(0, 0, element.width, element.height);
      if(!isThumbnail) {
        context.scale(canvasZoom, canvasZoom);
      }
      context.drawImage(element, 0, 0);
      context.restore();
    }

    drawToContext(selectionContext);
    thumbnailSelectionContext && drawToContext(thumbnailSelectionContext, true);
    lastSelectionStateRef.current = doGetCanvasCopy(selectionRef.current);
  }, [canvasZoom, isSelectionTransparent, colorData.secondary]);

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
      doSelectionDrawToSelection(image);
      URL.revokeObjectURL(image.src);
    }, 20);
  }, [canvasZoom, setCanvasSize, doSelectionDrawToSelection]);
  
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
    let usedCopy = doGetCanvasCopy(primaryRef.current);
    let usedClear = doCanvasClearPrimary;
    let offset = 0;

    if(selectionPhase === 2) {
      usedRef = selectionRef;
      usedContext = selectionContext;
      usedThumbnailContext = thumbnailSelectionContext;
      usedSize = selectionSize;
      usedSetSize = doSelectionSetSize;
      usedLastStateRef = lastSelectionStateRef;
      usedCopy = doGetCanvasCopy(selectionRef.current);
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
      function rotateAndDraw(context, isThumbnail) {
        context.save();
        if(selectionPhase === 2 && isThumbnail) {
          context.scale(1 / canvasZoom, 1 / canvasZoom);
        }
        context.translate(usedSize.width / 2, usedSize.height / 2);
        context.rotate(degreesToRadians(degree));
        context.translate(-usedSize.width / 2, -usedSize.height / 2);
        context.drawImage(usedCopy, offset, offset);
        context.restore();
      }

      rotateAndDraw(usedContext);
      usedThumbnailContext && rotateAndDraw(usedThumbnailContext, true);
      usedLastStateRef.current = doGetCanvasCopy(usedRef.current);

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
    let usedCopy = doGetCanvasCopy(primaryRef.current);

    if(selectionPhase === 2) {
      usedRef = selectionRef;
      usedContext = selectionContext;
      usedThumbnailContext = thumbnailSelectionContext;
      usedSize = selectionSize;
      usedLastStateRef = lastSelectionStateRef;
      usedClear = doSelectionClear;
      usedCopy = doGetCanvasCopy(selectionRef.current);
    }

    usedClear();

    function flipAndDraw(context, isThumbnail) {
      context.save();
      context.scale(direction === 'horizontal' ? -1 : 1, direction === 'vertical' ? -1 : 1);
      if(selectionPhase === 2 && isThumbnail) {
        context.scale(1 / canvasZoom, 1 / canvasZoom);
      }
      context.drawImage(
        usedCopy, 
        direction === 'horizontal' ? -usedSize.width : 0,
        direction === 'vertical' ? -usedSize.height : 0
      );
      context.restore();
    }

    flipAndDraw(usedContext);
    usedThumbnailContext && flipAndDraw(usedThumbnailContext, true);
    usedLastStateRef.current = doGetCanvasCopy(usedRef.current);

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
        thumbnailSelectionContext.save();
        thumbnailSelectionContext.scale(1 / canvasZoom, 1 / canvasZoom);
        thumbnailSelectionContext.drawImage(selectionRef.current, 0, 0);
        thumbnailSelectionContext.restore();
      }
      lastSelectionStateRef.current = doGetCanvasCopy(selectionRef.current);
    } else {
      primaryContext.putImageData(usedImageData, 0, 0);
      thumbnailPrimaryContext?.putImageData(usedImageData, 0, 0);
      doHistoryAdd({ element: primaryRef.current, ...canvasSize });
    }
  }
  
  return (
    <SelectionContext.Provider
      value={{
        selectionSize, setSelectionSize,
        selectionPosition, setSelectionPosition,
        selectionOutlineSize, setSelectionOutlineSize,
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
        doSharedCut,
        doSharedCopy,
        doSelectionSelectAll,
        doSelectionInvertSelection,
        doSharedDelete,
        doSelectionEnd,
        doSelectionGetEveryContext,
        doSharedRotate,
        doSharedFlip,
        doSharedInvertColor,
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