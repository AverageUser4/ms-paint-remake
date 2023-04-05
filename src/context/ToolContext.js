import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

import Fill from '../misc/tools/misc/Fill.js';
import Text from '../misc/tools/misc/Text.js';
import ColorPicker from '../misc/tools/misc/ColorPicker.js';
import Magnifier from '../misc/tools/misc/Magnifier.js';
import RectangularSelection from '../misc/tools/misc/RectangularSelection';

import Pencil from '../misc/tools/brushes/Pencil.js';
import Eraser from '../misc/tools/brushes/Eraser.js';
import Brush from '../misc/tools/brushes/Brush.js';
import Calligraphy1 from '../misc/tools/brushes/Calligraphy-1.js';
import Calligraphy2 from '../misc/tools/brushes/Calligraphy-2.js';
import Airbrush from '../misc/tools/brushes/Airbrush.js';
import Crayon from '../misc/tools/brushes/Crayon';
import Marker from '../misc/tools/brushes/Marker';
import NaturalPencil from '../misc/tools/brushes/NaturalPencil';
import Oilbrush from '../misc/tools/brushes/Oilbrush';
import Watercolor from '../misc/tools/brushes/Watercolor';
import FreeFormSelection from '../misc/tools/brushes/FreeFormSelection.js';

import ShapeRightTriangle from '../misc/tools/shapes/ShapeRightTriangle';

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
    ['selection-free-form', FreeFormSelection],
    /* shape */
    ['shape-right-triangle', ShapeRightTriangle],
  ]));
  const [currentTool, setCurrentTool] = useState('shape-right-triangle');
  const [latestTools, setLatestTools] = useState({ 
    brushes: 'brushes-brush',
    selection: 'selection-rectangle'
  });
  const [shapeData, setShapeData] = useState({
    outline: 'solid',
    fill: '',
  });
  const currentToolData = toolsData.get(currentTool);

  function doCurrentToolSetSize(newSize) {
    if(!Number.isInteger(newSize)) {
      console.error(`de_Expected integer, received: "${newSize}".`);
    }

    if(newSize < 1 || newSize > 50 || !currentToolData.sizes) {
      return;
    }
    
    setToolsData(prev => {
      const newToolsData = new Map(prev);
      const oldTool = newToolsData.get(currentTool);
      let newTool = Object.create(Object.getPrototypeOf(oldTool));
      newTool = Object.assign(newTool, oldTool);
      newTool.chosenSize = newSize;
      newToolsData.set(currentTool, newTool);
      return newToolsData;
    });
  }

  return (
    <ToolContext.Provider
      value={{
        toolsData,
        setToolsData,
        currentTool,
        setCurrentTool,
        latestTools,
        setLatestTools,
        currentToolData,
        doCurrentToolSetSize,
        shapeData,
        setShapeData,
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