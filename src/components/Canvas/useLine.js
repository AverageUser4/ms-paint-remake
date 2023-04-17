import { useState, useEffect } from 'react';
import usePointerTrack from '../../hooks/usePointerTrack';
import { useCanvasContext } from '../../context/CanvasContext';
import { useHistoryContext } from '../../context/HistoryContext';
import { useToolContext } from '../../context/ToolContext';
import { objectEquals } from '../../misc/utils';

function useLine() {
  const { 
    primaryRef, doCanvasClearPrimary, canvasSize,
    doGetEveryContext 
  } = useCanvasContext();
  const { doHistoryAdd } = useHistoryContext();
  const { currentTool } = useToolContext();
  const [lineData, setLineData] = useState(null);

  const { onPointerDown } = usePointerTrack({ 
    onPressedMoveCallback,
    onPressStartCallback,
    onPressEndCallback,
    isCancelOnRightMouseDown: true,
    isTrackAlsoRight: true,
  });
  
  function onPressStartCallback(event) {
    const primaryRect = primaryRef.current.getBoundingClientRect();
    const offsetX = event.pageX - primaryRect.x;
    const offsetY = event.pageY - primaryRect.y;
    
    setLineData({
      startX: offsetX,
      startY: offsetY,
      endX: offsetX,
      endY: offsetY,
    })
  }
  
  function onPressedMoveCallback(event) {
    const primaryRect = primaryRef.current.getBoundingClientRect();
    const offsetX = event.pageX - primaryRect.x;
    const offsetY = event.pageY - primaryRect.y;

    setLineData(prev => ({ ...prev, endX: offsetX, endY: offsetY }));
  }

  function onPressEndCallback() {
    setLineData(null);
  }

  useEffect(() => {
    if(!lineData) {
      return;
    }

    const { secondaryContext } = doGetEveryContext();
    secondaryContext.clearRect(0, 0, canvasSize.width, canvasSize.height);
    secondaryContext.beginPath();
    secondaryContext.moveTo(lineData.startX, lineData.startY);
    secondaryContext.lineTo(lineData.endX, lineData.endY);
    secondaryContext.stroke();
  });

  return {
    onPointerDownLine: onPointerDown,
  }
}

export default useLine;