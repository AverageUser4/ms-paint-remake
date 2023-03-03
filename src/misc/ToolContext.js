import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import Pencil from './tools/Pencil.js';
import Fill from './tools/Fill.js';
import Text from './tools/Text.js';
import Eraser from './tools/Eraser.js';
import ColorPicker from './tools/ColorPicker.js';
import Magnifier from './tools/Magnifier.js';
import Brush from './tools/Brush.js';
import Calligraphy1 from './tools/Calligraphy-1.js';
import Calligraphy2 from './tools/Calligraphy-2.js';
import Airbrush from './tools/Airbrush';
import Crayon from './tools/Crayon';
import Marker from './tools/Marker';
import NaturalPencil from './tools/NaturalPencil';
import Oilbrush from './tools/Oilbrush';
import Watercolor from './tools/Watercolor';
import RectangularSelection from './tools/RectangularSelection';
import FreeFormSelection from './tools/FreeFormSelection';

const ToolContext = createContext();

function ToolProvider({ children }) {
  const [toolsData, setToolsData] = useState(new Map([
    /* tools */
    ['pencil', Pencil],
    ['fill', Fill],
    ['text', Text],
    ['eraser', Eraser],
    ['color-picker', ColorPicker],
    ['magnifier', Magnifier],
    /* brushes */
    ['brushes-brush', Brush],
    ['brushes-calligraphy-1', Calligraphy1],
    ['brushes-calligraphy-2', Calligraphy2],
    ['brushes-airbrush', Airbrush],
    ['brushes-oilbrush', Oilbrush],
    ['brushes-crayon', Crayon],
    ['brushes-marker', Marker],
    ['brushes-natural-pencil', NaturalPencil],
    ['brushes-watercolor', Watercolor],
    /* selection */
    ['selection-rectangle', RectangularSelection],
    ['selection-free-form', FreeFormSelection]
  ]));
  const [currentTool, setCurrentTool] = useState('selection-free-form');
  const [latestTools, setLatestTools] = useState({ 
    brushes: 'brushes-brush',
    selection: 'selection-rectangle'
  });
  function doSetCurrentTool(tool) {
    if(currentTool.startsWith('brushes')) {
      setLatestTools(prev => ({ ...prev, brushes: currentTool }));
    } else if(currentTool.startsWith('selection')) {
      setLatestTools(prev => ({ ...prev, selection: currentTool }));
    }
    setCurrentTool(tool);
  }

  return (
    <ToolContext.Provider
      value={{
        toolsData,
        setToolsData,
        currentTool,
        setCurrentTool,
        doSetCurrentTool,
        latestTools
      }}
    >
      {children}
    </ToolContext.Provider>
  );
}

ToolProvider.propTypes = {
  children: PropTypes.node.isRequired
};

function useToolContext() {
  return useContext(ToolContext);
}

export {
  ToolProvider,
  useToolContext,
};