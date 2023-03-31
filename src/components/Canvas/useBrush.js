import usePointerTrack from "../../hooks/usePointerTrack";
import { useCanvasContext } from "../../context/CanvasContext";
import { useToolContext } from "../../context/ToolContext";
import { useColorContext } from "../../context/ColorContext";
import { useHistoryContext } from "../../context/HistoryContext";
import { useActionsContext } from "../../context/ActionsContext";
import { RGBObjectToString, getDrawData } from "../../misc/utils";

function useBrush({ brushCanvasRef }) {
  const { 
    primaryRef, secondaryRef, doCanvasDrawImageToPrimary,
    doCanvasClearSecondary, canvasZoom, canvasSize,
    lastPointerPositionRef, doGetEveryContext,
  } = useCanvasContext();
  const { currentTool, currentToolData } = useToolContext();
  const { colorData, setColorData } = useColorContext();
  const { doHistoryAdd } = useHistoryContext();
  const { doCanvasChangeZoom } = useActionsContext();
  
  let usedPressedMoveCallback = onPointerMoveCallback;
  let usedPressStartCallback = onPointerMoveCallback;
  let usedPressEndCallback = onPressEndCallback;
  let usedCancelCallback = onCancelCallback;

  if(currentToolData.onPointerMove) {
    usedPressedMoveCallback = (event) => currentToolData.onPointerMove({ event });
  }
  if(currentToolData.onPointerDown) {
    usedPressStartCallback = (event) => currentToolData.onPointerDown({
      ...doGetEveryContext(),
      event,
      canvasSize: canvasSize,
      colorData,
      setColorData,
      canvasZoom,
      doCanvasChangeZoom,
    });
  }
  if(currentToolData.onPointerUp) {
    usedPressEndCallback = (event) => currentToolData.onPointerUp({ event });
  }
  if(currentToolData.onCancel) {
    usedCancelCallback = (event) => currentToolData.onCancel({ event });
  }

  function onPointerMoveCallback(event) {
    const step = currentTool === 'airbrush' ? 5 : 1;
    const currentPixel = { ...lastPointerPositionRef.current };

    const { destinationPixel, doDrawLoop, } = getDrawData({
      event, secondaryRef, canvasZoom, currentPixel,
      pagePixel: { x: event.pageX, y: event.pageY },
    });

    lastPointerPositionRef.current = { x: destinationPixel.x, y: destinationPixel.y };

    if(currentToolData.doDrawIcon) {
      const brushContext = brushCanvasRef.current.getContext('2d');
      brushContext.clearRect(0, 0, canvasSize.width * canvasZoom, canvasSize.height * canvasZoom);
  
      currentToolData.doDrawIcon({
        currentPixel,
        color: colorData,
        brushContext,
        canvasZoom,
      });
    }

    if(currentlyPressedRef.current === -1) {
      return;
    }

    const { primaryContext, secondaryContext, thumbnailSecondaryContext } = doGetEveryContext();

    function setStyle(context) {
      context.fillStyle = currentlyPressedRef.current === 0 ? RGBObjectToString(colorData.primary) : RGBObjectToString(colorData.secondary);
      context.strokeStyle = currentlyPressedRef.current === 0 ? RGBObjectToString(colorData.primary) : RGBObjectToString(colorData.secondary);
    }

    setStyle(secondaryContext);
    thumbnailSecondaryContext && setStyle(thumbnailSecondaryContext);

    function doDraw(isRepeated) {
      currentToolData.draw({
        primaryContext,
        secondaryContext,
        thumbnailSecondaryContext,
        currentPixel: { x: Math.round(currentPixel.x), y: Math.round(currentPixel.y) },
        currentlyPressedRef,
        color: { ...colorData },
        isRepeated,
      });
    }

    doDraw(false);
    doDrawLoop(doDraw, step);
  }

  function onPressEndCallback() {
    lastPointerPositionRef.current = {};

    doCanvasDrawImageToPrimary(secondaryRef.current);
    doCanvasClearSecondary();

    doHistoryAdd({ 
      element: primaryRef.current,
      width: canvasSize.width,
      height: canvasSize.height
    });
  }

  function onCancelCallback() {
    lastPointerPositionRef.current = {};
    doCanvasClearSecondary();
  }

  const { onPointerDown, currentlyPressedRef } = usePointerTrack({ 
    onPressedMoveCallback: usedPressedMoveCallback,
    onEveryMoveCallback: usedPressedMoveCallback,
    onPressStartCallback: usedPressStartCallback,
    onPressEndCallback: usedPressEndCallback,
    onCancelCallback: usedCancelCallback,
    isCancelOnRightMouseDown: true,
    isTrackAlsoRight: true
  });

  return { 
    onPointerDownBrush: onPointerDown,
  };
}

export default useBrush;

