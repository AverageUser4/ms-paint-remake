import { useRef } from "react";
import { ImageDataUtils, getDrawData } from "../../misc/utils";
import usePointerTrack from "../../hooks/usePointerTrack";
import { useSelectionContext } from "../../context/SelectionContext";
import { useCanvasContext } from "../../context/CanvasContext";
import { useHistoryContext } from "../../context/HistoryContext";
import { useToolContext } from "../../context/ToolContext";
import { useColorContext } from "../../context/ColorContext";

function useFreeFormSelection() {
  const { 
    primaryRef, secondaryRef, doCanvasClearSecondary,
    canvasZoom, canvasSize, doGetEveryContext,
  } = useCanvasContext();
  const { doHistoryAdd } = useHistoryContext();
  const { currentToolData } = useToolContext();
  const { colorData } = useColorContext();

  const {
    setSelectionPhase,
    selectionRef,
    lastSelectionStateRef,
    selectionPhase,
    doSelectionDrawToPrimary,
    doSelectionDrawToSelection,
    doSelectionEnd,
    doSelectionSetSize,
    doSelectionSetPosition,
  } = useSelectionContext();

  const edgePositionRef = useRef();
  const initialPositionRef = useRef();
  const primaryImageDataRef = useRef();
  const lastPointerPositionLocalRef = useRef();

  function onPressStartCallback(event) {
    if(selectionPhase === 2) {
      doSelectionDrawToPrimary();
      doCancel();
      return;
    }

    primaryImageDataRef.current = primaryRef.current.getContext('2d').getImageData(0, 0, primaryRef.current.width, primaryRef.current.height);
    const { pageX, pageY } = event;
    const secondaryRect = secondaryRef.current.getBoundingClientRect();
    const offsetX = Math.round((pageX - secondaryRect.x) / canvasZoom);
    const offsetY = Math.round((pageY - secondaryRect.y) / canvasZoom);
    const position = { x: offsetX, y: offsetY };
    edgePositionRef.current = {
      minX: position.x,
      minY: position.y,
      maxX: position.x,
      maxY: position.y,
    };
    initialPositionRef.current = { pageX, pageY, offsetX, offsetY };

    onPressedMoveCallback(event);
  }

  function onPressedMoveCallback(event) {
    const step = 1;
    const currentPixel = { ...lastPointerPositionLocalRef.current };

    const { destinationPixel, doDrawLoop } = getDrawData({
      secondaryRef, canvasZoom, currentPixel,
      pagePixel: { x: event.pageX, y: event.pageY },
      isConstrained: true,
    });
    
    lastPointerPositionLocalRef.current = { x: destinationPixel.x, y: destinationPixel.y };

    edgePositionRef.current = {
      minX: Math.min(edgePositionRef.current.minX, destinationPixel.x),
      minY: Math.min(edgePositionRef.current.minY, destinationPixel.y),
      maxX: Math.max(edgePositionRef.current.maxX, destinationPixel.x),
      maxY: Math.max(edgePositionRef.current.maxY, destinationPixel.y),
    };

    function doDraw(isRepeated, isLast) {
      currentToolData.draw({
        ...doGetEveryContext(),
        currentPixel: { x: Math.round(currentPixel.x), y: Math.round(currentPixel.y) },
        currentlyPressedRef,
        colorData,
        primaryImageData: primaryImageDataRef.current,
        isRepeated,
        isLast,
      });
    }

    doDrawLoop(doDraw, step);
  }

  function onPressEndCallback() {
    onPressedMoveCallback(initialPositionRef.current, true);
    lastPointerPositionLocalRef.current = {};

    const x = Math.round(edgePositionRef.current.minX);
    const y = Math.round(edgePositionRef.current.minY);
    const width = Math.round(edgePositionRef.current.maxX - edgePositionRef.current.minX + 1);
    const height = Math.round(edgePositionRef.current.maxY - edgePositionRef.current.minY + 1);

    const { primaryContext, thumbnailPrimaryContext, secondaryContext } = doGetEveryContext();

    const boundariesImageData = secondaryContext.getImageData(x, y, width, height);
    doCanvasClearSecondary();
    lastSelectionStateRef.current = null;

    if(width < 6 || height < 6) {
      return;
    }

    doSelectionSetPosition({ x, y });
    doSelectionSetSize({ width, height });
    setSelectionPhase(2);

    new MutationObserver((records, observer) => {
      if(!document.querySelector('#pxp-selection-canvas')) {
        return;
      }
      observer.disconnect();

      const primaryImageData = primaryContext.getImageData(x, y, width, height);
      const selectionImageData = selectionRef.current.getContext('2d').getImageData(x, y, width, height);
      const filledMap = new Map();
      
      function getIsPixelFilled(column, row) {
        return filledMap.get(`${column},${row}`) || false;
      }

      function setIsPixelFilled(column, row) {
        filledMap.set(`${column},${row}`, true);
      }

      function getIsLinePixel(column, row) {
        if(column >= boundariesImageData.width || row >= boundariesImageData.height) {
          return false;
        }
        return ImageDataUtils.getColorFromCoords(boundariesImageData, column, row).a > 0;
      }

      function getIsThereTerminatingLine(column, row) {
        let horizontal = false;

        for(let i = column + 1; i < width; i += 2) {
          const isCurrentLinePixel = getIsLinePixel(i, row);
          if(isCurrentLinePixel) {
            horizontal = true;
            break;
          }
        }

        if(horizontal) {
          for(let i = row + 1; i < height; i += 2) {
            const isCurrentLinePixel = getIsLinePixel(column, i);
            if(isCurrentLinePixel) {
              return true;
            }
          } 
        }

        return false;
      }

      function getIsPixelAboveTopLineFilled(column, row) {
        while(row >= 0 && getIsLinePixel(column, row)) {
          row--;
        }

        if(row < 0) {
          return false;
        }

        return getIsPixelFilled(column, row) || false;
      }

      const startTime = performance.now();

      for(let row = 1; row < height; row++) {
        if(performance.now() - startTime > 3_000) {
          console.error('de_Time limit for free form selection exceeded.');
          return;
        }
        let isPixelOnLeftToLatestLineFilled = false;

        for(let column = 1; column < width; column++) {
          const isCurrentLinePixel = getIsLinePixel(column, row);

          if(
              (!isCurrentLinePixel && (getIsPixelFilled(column - 1, row) || getIsPixelFilled(column, row - 1))) ||
              (!isCurrentLinePixel && !isPixelOnLeftToLatestLineFilled && getIsLinePixel(column - 1, row) && getIsLinePixel(column, row - 1) && !getIsPixelAboveTopLineFilled(column, row - 2) && getIsThereTerminatingLine(column, row))
            ) {
            const primaryColor = ImageDataUtils.getColorFromCoords(primaryImageData, column, row);
            ImageDataUtils.setColorAtCoords(selectionImageData, column, row, primaryColor);
            ImageDataUtils.setColorAtCoords(primaryImageData, column, row, colorData.secondary);
            setIsPixelFilled(column, row);

            if(getIsLinePixel(column + 1, row)) {
              isPixelOnLeftToLatestLineFilled = true
            }
          } else if(!isCurrentLinePixel && getIsLinePixel(column + 1, row)) {
            isPixelOnLeftToLatestLineFilled = false;
          }
        }
      }

      doSelectionDrawToSelection(selectionImageData);

      primaryContext.putImageData(primaryImageData, x, y);
      thumbnailPrimaryContext?.putImageData(primaryImageData, x, y);
      doHistoryAdd({
        element: primaryRef.current,
        ...canvasSize,
      });
    }).observe(document.querySelector('#pxp-direct-canvas-container'), { childList: true });
  }

  function onCancelCallback() {
    doSelectionEnd();
    lastPointerPositionLocalRef.current = {};
    doCanvasClearSecondary();
  }

  const { onPointerDown, currentlyPressedRef, doCancel } = usePointerTrack({ 
    onPressedMoveCallback,
    onPressStartCallback,
    onPressEndCallback,
    onCancelCallback,
    isCancelOnRightMouseDown: true,
    isTrackAlsoRight: true
  });

  return { 
    onPointerDownFreeFormSelection: onPointerDown,
  };
}

export default useFreeFormSelection;

