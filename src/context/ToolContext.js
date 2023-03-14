import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

import Pencil from '../misc/tools/Pencil.js';
import Fill from '../misc/tools/Fill.js';
import Text from '../misc/tools/Text.js';
import Eraser from '../misc/tools/Eraser.js';
import ColorPicker from '../misc/tools/ColorPicker.js';
import Magnifier from '../misc/tools/Magnifier.js';
import Brush from '../misc/tools/Brush.js';
import Calligraphy1 from '../misc/tools/Calligraphy-1.js';
import Calligraphy2 from '../misc/tools/Calligraphy-2.js';
import Airbrush from '../misc/tools/Airbrush';
import Crayon from '../misc/tools/Crayon';
import Marker from '../misc/tools/Marker';
import NaturalPencil from '../misc/tools/NaturalPencil';
import Oilbrush from '../misc/tools/Oilbrush';
import Watercolor from '../misc/tools/Watercolor';
import RectangularSelection from '../misc/tools/RectangularSelection';
import FreeFormSelection from '../misc/tools/FreeFormSelection';

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
  const [currentTool, setCurrentTool] = useState('pencil');
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