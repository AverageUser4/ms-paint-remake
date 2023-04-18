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

import ShapeLine from '../misc/tools/shapes/ShapeLine';
import ShapeCurve from '../misc/tools/shapes/ShapeCurve';
import ShapeOval from '../misc/tools/shapes/ShapeOval';
import ShapeRectangle from '../misc/tools/shapes/ShapeRectangle';
import ShapeRoundedRectangle from '../misc/tools/shapes/ShapeRoundedRectangle';
import ShapePolygon from '../misc/tools/shapes/ShapePolygon';
import ShapeTriangle from '../misc/tools/shapes/ShapeTriangle';
import ShapeRightTriangle from '../misc/tools/shapes/ShapeRightTriangle';
import ShapeDiamond from '../misc/tools/shapes/ShapeDiamond';
import ShapePentagon from '../misc/tools/shapes/ShapePentagon';
import ShapeHexagon from '../misc/tools/shapes/ShapeHexagon';
import ShapeRightArrow from '../misc/tools/shapes/ShapeRightArrow';
import ShapeLeftArrow from '../misc/tools/shapes/ShapeLeftArrow';
import ShapeUpArrow from '../misc/tools/shapes/ShapeUpArrow';
import ShapeDownArrow from '../misc/tools/shapes/ShapeDownArrow';
import ShapeFourPointStar from '../misc/tools/shapes/ShapeFourPointStar';
import ShapeFivePointStar from '../misc/tools/shapes/ShapeFivePointStar';
import ShapeSixPointStar from '../misc/tools/shapes/ShapeSixPointStar';
import ShapeRoundedRectangularCallout from '../misc/tools/shapes/ShapeRoundedRectangularCallout';
import ShapeOvalCallout from '../misc/tools/shapes/ShapeOvalCallout';
import ShapeCloudCallout from '../misc/tools/shapes/ShapeCloudCallout';
import ShapeHeart from '../misc/tools/shapes/ShapeHeart';
import ShapeLightning from '../misc/tools/shapes/ShapeLightning';

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
    ['shape-line', ShapeLine],
    ['shape-curve', ShapeCurve],
    ['shape-oval', ShapeOval],
    ['shape-rectangle', ShapeRectangle],
    ['shape-rounded-rectangle', ShapeRoundedRectangle],
    ['shape-polygon', ShapePolygon],
    ['shape-triangle', ShapeTriangle],
    ['shape-right-triangle', ShapeRightTriangle],
    ['shape-diamond', ShapeDiamond],
    ['shape-pentagon', ShapePentagon],
    ['shape-hexagon', ShapeHexagon],
    ['shape-right-arrow', ShapeRightArrow],
    ['shape-left-arrow', ShapeLeftArrow],
    ['shape-up-arrow', ShapeUpArrow],
    ['shape-down-arrow', ShapeDownArrow],
    ['shape-four-point-star', ShapeFourPointStar],
    ['shape-five-point-star', ShapeFivePointStar],
    ['shape-six-point-star', ShapeSixPointStar],
    ['shape-rounded-rectangular-callout', ShapeRoundedRectangularCallout],
    ['shape-oval-callout', ShapeOvalCallout],
    ['shape-cloud-callout', ShapeCloudCallout],
    ['shape-heart', ShapeHeart],
    ['shape-lightning', ShapeLightning],
  ]));
  const [currentTool, setCurrentTool] = useState('shape-curve');
  const [latestTools, setLatestTools] = useState({ 
    brushes: 'brushes-brush',
    selection: 'selection-rectangle'
  });
  const currentToolData = toolsData.get(currentTool);

  if(!currentToolData) {
    console.error('de_currentTool set to unrecognized value:', currentTool);
  }

  const [shapeData, setShapeData] = useState({
    outline: 'solid',
    fill: '',
  });

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