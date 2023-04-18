import React, { useState, useEffect } from 'react';
import usePointerTrack from '../../hooks/usePointerTrack';
import { useCanvasContext } from '../../context/CanvasContext';
import { useLineContext } from '../../context/LineContext';
import { useToolContext } from '../../context/ToolContext';
import { useColorContext } from '../../context/ColorContext';
import useUnchangingCursor from '../../hooks/useUnchangingCursor';
import useMove from '../../hooks/useMove';

function useLine() {
  const { 
    primaryRef, canvasSize, doGetEveryContext, canvasZoom,
    doCanvasClearSecondary,
  } = useCanvasContext();

  const { 
    lineData, setLineData, linePhase, setLinePhase,
    doLineDrawToPrimary, doLineEnd
  } = useLineContext();

  const { currentTool, shapeData, currentToolData } = useToolContext();
  const { colorData } = useColorContext();
  
  const [trackedEnd, setTrackedEnd] = useState(false);
  const [linePosition, setLinePosition] = useState({ x: 0, y: 0 });
  const [moveStartLineData, setMoveStartLineData] = useState(null);

  const { onPointerDownMove, isMovePressed } = useMove({
    containerRef: primaryRef,
    position: linePosition,
    setPosition: setLinePosition,
    canvasZoom,
    size: { width: 1, height: 1 },
    setSize: () => 0,
    onStartCallback: () => {
      setLinePosition({ x: 0, y: 0 });
      setMoveStartLineData({ ...lineData });
    },
    onEndCallback: () => {
      setLinePosition({ x: 0, y: 0 });
      setMoveStartLineData(null);
    },
  });

  let cursorTypeObject = null;
  cursorTypeObject = trackedEnd ? { type: 'top' } : cursorTypeObject;
  cursorTypeObject = isMovePressed ? { type: 'move' } : cursorTypeObject;
  useUnchangingCursor(cursorTypeObject);

  const { onPointerDown, currentlyPressedRef } = usePointerTrack({ 
    onPressedMoveCallback,
    onPressStartCallback,
    onPressEndCallback,
    onCancelCallback,
    isCancelOnRightMouseDown: true,
    isTrackAlsoRight: true,
  });
  
  function onPressStartCallback(event) {
    doLineDrawToPrimary();
    doLineEnd();
    
    const primaryRect = primaryRef.current.getBoundingClientRect();
    const offsetX = Math.round(event.pageX - primaryRect.x) / canvasZoom;
    const offsetY = Math.round(event.pageY - primaryRect.y) / canvasZoom;
    
    setLineData({
      x1: offsetX, y1: offsetY,
      x2: offsetX, y2: offsetY,
    });
  }
  
  function onPressedMoveCallback(event) {
    const primaryRect = primaryRef.current.getBoundingClientRect();
    const offsetX = Math.round(event.pageX - primaryRect.x) / canvasZoom;
    const offsetY = Math.round(event.pageY - primaryRect.y) / canvasZoom;

    setLineData(prev => ({ ...prev, x2: offsetX, y2: offsetY }));
  }

  function onPressEndCallback() {
    if(
        Math.abs(lineData.x1 - lineData.x2) + Math.abs(lineData.y1 - lineData.y2) < 2 ||
        currentTool !== 'shape-line'
      ) {
      doLineEnd();
      return;
    }
    
    setLinePhase(1);
  }

  function onCancelCallback() {
    doLineEnd();
    doCanvasClearSecondary();
  }

  useEffect(() => {
    if(
        currentTool !== 'shape-line' ||
        !lineData ||
        Math.abs(lineData.x1 - lineData.x2) + Math.abs(lineData.y1 - lineData.y2) < 2
      ) {
      return;
    }

    if(currentlyPressedRef.current !== -1 || linePhase) {
      currentToolData.drawShape({ 
        ...doGetEveryContext(),
        colorData,
        canvasSize,
        currentlyPressedRef,
        shapeData,
        lineData,
      });
    }
  });

  useEffect(() => {
    if(!trackedEnd) {
      return;
    }

    function onPointerUp() {
      setTrackedEnd(null);
    }

    function onPointerMove(event) {
      const primaryRect = primaryRef.current.getBoundingClientRect();
      const offsetX = Math.round(event.pageX - primaryRect.x) / canvasZoom;
      const offsetY = Math.round(event.pageY - primaryRect.y) / canvasZoom;

      setLineData(prev => ({ 
        ...prev,
        [`x${trackedEnd}`]: offsetX,
        [`y${trackedEnd}`]: offsetY,
      }));
    }

    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointermove', onPointerMove);

    return () => {
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, [trackedEnd, canvasZoom, primaryRef, setLineData]);

  useEffect(() => {
    if(!moveStartLineData) {
      return;
    }

    setLineData({
      x1: moveStartLineData.x1 + linePosition.x,
      y1: moveStartLineData.y1 + linePosition.y,
      x2: moveStartLineData.x2 + linePosition.x,
      y2: moveStartLineData.y2 + linePosition.y,
    });
  }, [moveStartLineData, linePosition, setLineData]);

  const lineElements = (!linePhase || !lineData || currentTool !== 'shape-line') ? null : (
    <>
      <svg 
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        width={canvasSize.width}
        height={canvasSize.height}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: canvasSize.width * canvasZoom,
          height: canvasSize.height * canvasZoom,
          pointerEvents: 'none',
        }}
      >
        <line
          // stroke="red"
          strokeWidth={(currentToolData.chosenSize + 10) * canvasZoom}
          x1={lineData.x1 * canvasZoom} 
          y1={lineData.y1 * canvasZoom} 
          x2={lineData.x2 * canvasZoom} 
          y2={lineData.y2 * canvasZoom}
          style={{
            cursor: 'move',
            pointerEvents: 'all',
          }}
          onPointerDown={(event) => onPointerDownMove(event)}
        />
      </svg>

      <div
        className="line-resizer"
        style={{
          top: lineData.y1 * canvasZoom - 10,
          left: lineData.x1 * canvasZoom - 10,
        }}
        onPointerDown={() => setTrackedEnd(1)}
      />

      <div
        className="line-resizer"
        style={{
          top: lineData.y2 * canvasZoom - 10,
          left: lineData.x2 * canvasZoom - 10,
        }}
        onPointerDown={() => setTrackedEnd(2)}
      />
    </>
  );

  return {
    onPointerDownLine: onPointerDown,
    lineElements,
  }
}

export default useLine;