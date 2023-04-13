import { useEffect, useRef } from "react";
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

    primaryImageDataRef.current = primaryRef.current.getContext('2d').getImageData(
      0, 0, primaryRef.current.width, primaryRef.current.height);
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
      const selectionCanvas = document.querySelector('#pxp-selection-canvas');
      if(!selectionCanvas) {
        return;
      }
      observer.disconnect();

      const primaryImageData = primaryContext.getImageData(x, y, width, height);
      const selectionImageData = selectionRef.current.getContext('2d').getImageData(x, y, width, height);
      
      function isThereTerminatingLine(column, row) {
        for(let i = column + 2; i < width; i++) {
          const isBlack = ImageDataUtils.getColorFromCoords(boundariesImageData, i, row).a > 0;
          if(isBlack) {
            return true;
          }
        }
        return false;
      }
      
      for(let row = 0; row < height; row++) {
        let isWithinLine = false;

        for(let column = 0; column < width; column++) {
          const isBlack = ImageDataUtils.getColorFromCoords(boundariesImageData, column, row).a > 0;
          const isNextBlack = column === width - 1 ? false : ImageDataUtils.getColorFromCoords(boundariesImageData, column + 1, row).a > 0;

          if(isWithinLine && isNextBlack) {
              isWithinLine = false;
          } else if(!isWithinLine && isBlack && !isNextBlack) {
            if(isThereTerminatingLine(column, row)) {
              isWithinLine = true;
            }
          }
          
          if(isWithinLine) {
            const primaryColor = ImageDataUtils.getColorFromCoords(primaryImageData, column, row);
            ImageDataUtils.setColorAtCoords(selectionImageData, column, row, primaryColor);
            ImageDataUtils.setColorAtCoords(primaryImageData, column, row, colorData.secondary);
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

