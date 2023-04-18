import React from "react";

import useResize from "../../hooks/useResize";
import useSelection from "./useSelection";
import useBrush from "./useBrush";
import useLine from "./useLine";
import useCurve from "./useCurve";
import { useCanvasContext } from "../../context/CanvasContext";
import { useCanvasMiscContext } from "../../context/CanvasMiscContext";
import { useHistoryContext } from "../../context/HistoryContext";
import { useToolContext } from "../../context/ToolContext";
import { useSelectionContext } from "../../context/SelectionContext";
import { MAX_CANVAS_SIZE } from "../../misc/data";
import GridLines from "./GridLines";
import BrushCanvas from "./BrushCanvas";
import SelectionCanvas from "./SelectionCanvas";
import SecondaryCanvas from "./SecondaryCanvas";
import PrimaryCanvas from "./PrimaryCanvas";

function Canvas() {
  const { 
    canvasSize, canvasZoom, setCanvasSize, primaryRef, canvasStyle
  } = useCanvasContext();
  
  const { selectionPhase } = useSelectionContext();
  const { canvasOutlineSize, setCanvasOutlineSize, } = useCanvasMiscContext();
  const { currentTool } = useToolContext();
  const { doHistoryAdd } = useHistoryContext();

  const { onPointerDownBrush } = useBrush();
  const { onPointerDownLine, lineElements } = useLine();
  const { onPointerDownCurve } = useCurve();

  const { 
    selectionResizeGrabElements, selectionResizeOutlineElement, onPointerDownSelectionMove,
    onPointerDownRectangularSelection, onPointerDownFreeFormSelection
  } = useSelection();

  let onPointerDownSecondary = onPointerDownBrush;
  if(currentTool === 'shape-line') {
    onPointerDownSecondary = onPointerDownLine;
  } else if(currentTool === 'shape-curve') {
    onPointerDownSecondary = onPointerDownCurve;
  } else if(currentTool === 'selection-free-form') {
    onPointerDownSecondary = onPointerDownFreeFormSelection;
  } else if(currentTool === 'selection-rectangle' || currentTool.startsWith('shape')) {
    onPointerDownSecondary = onPointerDownRectangularSelection;
  } 

  const { 
    resizeGrabElements: canvasResizeGrabElements,
    resizeOutlineElement: canvasResizeOutlineElement 
  } = useResize({ 
    position: { x: 0, y: 0 },
    setPosition: ()=>0,
    size: canvasOutlineSize || canvasSize,
    setSize: setCanvasOutlineSize,
    minimalSize: { width: 1, height: 1, },
    maximalSize: { 
      width: MAX_CANVAS_SIZE * canvasZoom,
      height: MAX_CANVAS_SIZE * canvasZoom 
    },
    canvasZoom,
    onPressEndCallback: onPointerUpCallbackResize,
    isAllowToLeaveViewport: true,
    isResizable: true,
    isPointBased: true,
    isOnlyThreeDirections: true,
    isCancelOnRightMouseDown: true,
  });

  function onPointerUpCallbackResize() {
    if(!canvasOutlineSize) {
      return;
    }

    let { width, height } = canvasOutlineSize;
    width = Math.round(width / canvasZoom);
    height = Math.round(height / canvasZoom);

    setCanvasSize({ width, height });
    setCanvasOutlineSize(null);
    doHistoryAdd({ element: primaryRef.current, width, height });
  }

  return (
    <div 
      id="pxp-direct-canvas-container"
      className="point-container"
    >
      <div style={canvasStyle}></div>

      <PrimaryCanvas/>

      <SecondaryCanvas
        onPointerDownSecondary={onPointerDownSecondary}
      />

      {lineElements}

      <SelectionCanvas
        onPointerDownSelectionMove={onPointerDownSelectionMove}
        selectionResizeGrabElements={selectionResizeGrabElements}
        selectionResizeOutlineElement={selectionResizeOutlineElement}
      />

      {
        selectionPhase !== 2 && 
          <>
            {canvasResizeOutlineElement}
            {canvasResizeGrabElements}
          </>
      }

      <BrushCanvas/>

      <GridLines/>
    </div>
  );
}

export default Canvas;