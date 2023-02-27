import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { HSLtoRGB, objectEquals } from "../misc/utils";

const initialCustomColors = [];
for(let i = 0; i < 16; i ++) {
  initialCustomColors.push({ r: 255, g: 255, b: 255 });
}

const PaintContext = createContext();

const WIDTH = 300;
const HEIGHT = 200;

/* http://jsfiddle.net/d9VRu/ */
function calculatePoint(originX, originY, radius) {
  const angle = Math.random() * Math.PI * 2;
  const r = Math.sqrt(Math.random()) * radius;
  const x = originX + r * Math.cos(angle);
  const y = originY + r * Math.sin(angle);
  return { x: x, y: y };
}

function PaintProvider({ children }) {
  const [colorData, setColorData] = useState({
    primary: '#000',
    secondary: '#fff',
    selected: 'primary'
  });
  
  const airbrushIntervalRef = useRef(null);
  const [toolsData, setToolsData] = useState(new Map([
    /* tools */
    [
      'pencil',
      {
        sizes: [1, 2, 3, 4],
        chosenSizeIndex: 0,
        isBrush: true,
        draw({ context, curX, curY }) {
          const size = this.sizes[this.chosenSizeIndex];
          
          if(size <= 2) {
            context.fillRect(curX, curY, size, size);
          } else if(size === 3) {
            context.fillRect(curX - 1, curY, 3, 1);
            context.fillRect(curX, curY - 1, 1, 3);
          } else if(size === 4) {
            context.fillRect(curX - 1, curY, 4, 2);
            context.fillRect(curX, curY - 1, 2, 4);
          }
        },
      },
    ],
    [
      'fill',
      {
        sizes: [1, 2, 3, 4],
        chosenSizeIndex: 0,
        isBrush: true,
        draw({ context, curX, curY }) {
          const size = this.sizes[this.chosenSizeIndex];
          
          if(size <= 2) {
            context.fillRect(curX, curY, size, size);
          } else if(size === 3) {
            context.fillRect(curX - 1, curY, 3, 1);
            context.fillRect(curX, curY - 1, 1, 3);
          } else if(size === 4) {
            context.fillRect(curX - 1, curY, 4, 2);
            context.fillRect(curX, curY - 1, 2, 4);
          }
        },
      },
    ],
    [
      'text',
      {
        sizes: [1, 2, 3, 4],
        chosenSizeIndex: 0,
        isBrush: true,
        draw({ context, curX, curY }) {
          const size = this.sizes[this.chosenSizeIndex];
          
          if(size <= 2) {
            context.fillRect(curX, curY, size, size);
          } else if(size === 3) {
            context.fillRect(curX - 1, curY, 3, 1);
            context.fillRect(curX, curY - 1, 1, 3);
          } else if(size === 4) {
            context.fillRect(curX - 1, curY, 4, 2);
            context.fillRect(curX, curY - 1, 2, 4);
          }
        },
      },
    ],
    [
      'eraser',
      {
        sizes: [4, 6, 8, 10],
        chosenSizeIndex: 2,
        isBrush: true,
        draw({ context, curX, curY }) {
          const size = this.sizes[this.chosenSizeIndex];
          
          context.fillStyle = colorData.secondary;
          context.fillRect(curX, curY, size, size);
        },
      },
    ],
    [
      'color-picker',
      {
        sizes: [1, 2, 3, 4],
        chosenSizeIndex: 0,
        isBrush: true,
        draw({ context, curX, curY }) {
          const size = this.sizes[this.chosenSizeIndex];
          
          if(size <= 2) {
            context.fillRect(curX, curY, size, size);
          } else if(size === 3) {
            context.fillRect(curX - 1, curY, 3, 1);
            context.fillRect(curX, curY - 1, 1, 3);
          } else if(size === 4) {
            context.fillRect(curX - 1, curY, 4, 2);
            context.fillRect(curX, curY - 1, 2, 4);
          }
        },
      },
    ],
    [
      'magnifier',
      {
        sizes: [1, 2, 3, 4],
        chosenSizeIndex: 0,
        isBrush: true,
        draw({ context, curX, curY }) {
          const size = this.sizes[this.chosenSizeIndex];
          
          if(size <= 2) {
            context.fillRect(curX, curY, size, size);
          } else if(size === 3) {
            context.fillRect(curX - 1, curY, 3, 1);
            context.fillRect(curX, curY - 1, 1, 3);
          } else if(size === 4) {
            context.fillRect(curX - 1, curY, 4, 2);
            context.fillRect(curX, curY - 1, 2, 4);
          }
        },
      },
    ],

    /* brushes */
    [
      'brushes-brush',
      {
        sizes: [1, 3, 5, 8],
        chosenSizeIndex: 1,
        isBrush: true,
        draw({ context, curX, curY }) {
          const size = this.sizes[this.chosenSizeIndex];

          context.beginPath();
          context.arc(curX, curY, size, 0, Math.PI * 2);
          context.fill();
        },
      },
    ],
    [
      'brushes-calligraphy-1',
      {
        sizes: [3, 5, 8, 10],
        chosenSizeIndex: 1,
        isBrush: true,
        draw({ context, curX, curY }) {
          const size = this.sizes[this.chosenSizeIndex];

          if(size === 3) {
            context.fillRect(curX - 1, curY + 1, 2, 1);
            context.fillRect(curX, curY, 2, 1);
            context.fillRect(curX + 1, curY - 1, 2, 1);
          } else if(size === 5) {
            context.fillRect(curX - 2, curY + 2, 2, 1);
            context.fillRect(curX - 1, curY + 1, 2, 1);
            context.fillRect(curX, curY, 2, 1);
            context.fillRect(curX + 1, curY - 1, 2, 1);
            context.fillRect(curX + 2, curY - 2, 2, 1);
          } else if(size === 8) {
            context.fillRect(curX - 4, curY + 4, 2, 1);
            context.fillRect(curX - 3, curY + 3, 2, 1);
            context.fillRect(curX - 2, curY + 2, 2, 1);
            context.fillRect(curX - 1, curY + 1, 2, 1);
            context.fillRect(curX, curY, 2, 1);
            context.fillRect(curX + 1, curY - 1, 2, 1);
            context.fillRect(curX + 2, curY - 2, 2, 1);
            context.fillRect(curX + 3, curY - 3, 2, 1);
          } else if(size === 10) {
            context.fillRect(curX - 5, curY + 5, 2, 1);
            context.fillRect(curX - 4, curY + 4, 2, 1);
            context.fillRect(curX - 3, curY + 3, 2, 1);
            context.fillRect(curX - 2, curY + 2, 2, 1);
            context.fillRect(curX - 1, curY + 1, 2, 1);
            context.fillRect(curX, curY, 2, 1);
            context.fillRect(curX + 1, curY - 1, 2, 1);
            context.fillRect(curX + 2, curY - 2, 2, 1);
            context.fillRect(curX + 3, curY - 3, 2, 1);
            context.fillRect(curX + 4, curY - 4, 2, 1);
          }
        },
      },
    ],
    [
      'brushes-calligraphy-2',
      {
        sizes: [3, 5, 8, 10],
        chosenSizeIndex: 1,
        isBrush: true,
        draw({ context, curX, curY }) {
          const size = this.sizes[this.chosenSizeIndex];

          if(size === 3) {
            context.fillRect(curX - 1, curY - 1, 2, 1);
            context.fillRect(curX, curY, 2, 1);
            context.fillRect(curX + 1, curY + 1, 2, 1);
          } else if(size === 5) {
            context.fillRect(curX - 2, curY - 2, 2, 1);
            context.fillRect(curX - 1, curY - 1, 2, 1);
            context.fillRect(curX, curY, 2, 1);
            context.fillRect(curX + 1, curY + 1, 2, 1);
            context.fillRect(curX + 2, curY + 2, 2, 1);
          } else if(size === 8) {
            context.fillRect(curX - 4, curY - 4, 2, 1);
            context.fillRect(curX - 3, curY - 3, 2, 1);
            context.fillRect(curX - 2, curY - 2, 2, 1);
            context.fillRect(curX - 1, curY - 1, 2, 1);
            context.fillRect(curX, curY, 2, 1);
            context.fillRect(curX + 1, curY + 1, 2, 1);
            context.fillRect(curX + 2, curY + 2, 2, 1);
            context.fillRect(curX + 3, curY + 3, 2, 1);
          } else if(size === 10) {
            context.fillRect(curX - 5, curY - 5, 2, 1);
            context.fillRect(curX - 4, curY - 4, 2, 1);
            context.fillRect(curX - 3, curY - 3, 2, 1);
            context.fillRect(curX - 2, curY - 2, 2, 1);
            context.fillRect(curX - 1, curY - 1, 2, 1);
            context.fillRect(curX, curY, 2, 1);
            context.fillRect(curX + 1, curY + 1, 2, 1);
            context.fillRect(curX + 2, curY + 2, 2, 1);
            context.fillRect(curX + 3, curY + 3, 2, 1);
            context.fillRect(curX + 4, curY + 4, 2, 1);
          }
        },
      },
    ],
    [
      'brushes-airbrush',
      {
        sizes: [4, 8, 16, 24],
        chosenSizeIndex: 1,
        isBrush: true,
        draw({ context, curX, curY }) {
          const size = this.sizes[this.chosenSizeIndex];

          function drawRandomPoints() {
            for(let i = 0; i < size; i++) {
              const { x: randX, y: randY } = calculatePoint(curX, curY, size);
              context.fillRect(Math.round(randX), Math.round(randY), 1, 1);
            }
          }

          drawRandomPoints();
          if(airbrushIntervalRef.current === null) {
            airbrushIntervalRef.current = setInterval(drawRandomPoints, 100);
          }
        },
      },
    ],
    [
      'brushes-oilbrush',
      {
        sizes: [8, 16, 30, 40],
        chosenSizeIndex: 1,
        isBrush: true,
        draw({ context, curX, curY }) {
          /* TODO: add unique implementation */
          const size = this.sizes[this.chosenSizeIndex];

          context.beginPath();
          context.arc(curX, curY, size, 0, Math.PI * 2);
          context.fill();
        },
      },
    ],
    [
      'brushes-crayon',
      {
        sizes: [8, 16, 30, 40],
        chosenSizeIndex: 1,
        isBrush: true,
        draw({ context, curX, curY }) {
          /* TODO: add unique implementation */
          const size = this.sizes[this.chosenSizeIndex];

          context.beginPath();
          context.arc(curX, curY, size, 0, Math.PI * 2);
          context.fill();
        },
      },
    ],
    [
      'brushes-marker',
      {
        sizes: [8, 16, 30, 40],
        chosenSizeIndex: 1,
        isBrush: true,
        draw({ context, curX, curY }) {
          /* TODO: add unique implementation */
          const size = this.sizes[this.chosenSizeIndex];

          context.beginPath();
          context.arc(curX, curY, size, 0, Math.PI * 2);
          context.fill();
        },
      },
    ],
    [
      'brushes-natural-pencil',
      {
        sizes: [8, 16, 30, 40],
        chosenSizeIndex: 1,
        isBrush: true,
        draw({ context, curX, curY }) {
          /* TODO: add unique implementation */
          const size = this.sizes[this.chosenSizeIndex];

          context.beginPath();
          context.arc(curX, curY, size, 0, Math.PI * 2);
          context.fill();
        },
      },
    ],
    [
      'brushes-watercolor',
      {
        sizes: [8, 16, 30, 40],
        chosenSizeIndex: 1,
        isBrush: true,
        draw({ context, curX, curY }) {
          /* TODO: add unique implementation */
          const size = this.sizes[this.chosenSizeIndex];

          context.beginPath();
          context.arc(curX, curY, size, 0, Math.PI * 2);
          context.fill();
        },
      },
    ],
  ]));
  const [currentTool, setCurrentTool] = useState('pencil');
  useEffect(() => {
    function clearAirbrushInterval() {
      clearInterval(airbrushIntervalRef.current);
      airbrushIntervalRef.current = null;
    }

    window.addEventListener('pointerup', clearAirbrushInterval);
    window.addEventListener('pointermove', clearAirbrushInterval);

    return () => {
      window.removeEventListener('pointerup', clearAirbrushInterval);
      window.removeEventListener('pointermove', clearAirbrushInterval);
    }
  }, []);

  const [canvasData, setCanvasData] = useState({
    mousePosition: null,
    size: { width: WIDTH, height: HEIGHT },
    outlineSize: null,
    zoom: 1,
  });

  const [customColors, setCustomColors] = useState(initialCustomColors);
  const [customColorsPointer, setCustomColorsPointer] = useState(0);
  function doCustomColorsAdd(color) {
    setCustomColors(prev => {
      const copy = [...prev];
      copy[customColorsPointer] = color;
      return copy;
    });

    setCustomColorsPointer(prev => prev + 1 > 15 ? 0 : prev + 1);
  }

  const [ribbonColorsArray, setRibbonColorsArray] = useState([
    { r: 0, g: 0, b: 0 }, { r: 127, g: 127, b: 127 }, { r: 136, g: 0, b: 21 }, { r: 237, g: 28, b: 36 }, { r: 255, g: 127, b: 39 },
    { r: 255, g: 242, b: 0 }, { r: 34, g: 177, b: 76 }, { r: 0, g: 162, b: 232 }, { r: 63, g: 72, b: 204 }, { r: 163, g: 73, b: 164 },
    { r: 255, g: 255, b: 255 }, { r: 195, g: 195, b: 195 }, { r: 185, g: 122, b: 87 }, { r: 255, g: 174, b: 201 }, { r: 255, g: 201, b: 14 },
    { r: 239, g: 228, b: 176 }, { r: 181, g: 230, b: 29 }, { r: 153, g: 217, b: 234 }, { r: 112, g: 146, b: 190 }, { r: 200, g: 191, b: 231 }
  ]);
  function doRibbonColorsArrayAdd(color) {
    const existingIndex = ribbonColorsArray.findIndex((object, index) => index >= 20 && objectEquals(object, color));
    const copy = [...ribbonColorsArray];

    if(existingIndex !== -1) {
      const removedArray = copy.splice(existingIndex, 1);
      copy.push(removedArray[0]);
    } else if(copy.length < 30) {
      copy.push(color);
    } else {
      copy.splice(20, 1);
      copy.push(color);
    }
    
    setRibbonColorsArray(copy);
  }
  
  const [colorPickerData, setColorPickerData] = useState({
    HSL: { h: 200, s: 60, l: 50 },
    RGB: HSLtoRGB({ h: 200, s: 60, l: 50 }),
  })

  const [history, setHistory] = useState({
    dataArray: [{ element: document.createElement('canvas'), width: WIDTH, height: HEIGHT }],
    currentIndex: 0
  });

  function doHistoryAdd(data) {
    const newDataArray = history.dataArray.slice(0, history.currentIndex + 1);
    newDataArray.push(data);

    setHistory(prev => ({ ...prev, dataArray: newDataArray, currentIndex: prev.currentIndex + 1 }));
  }

  return (
    <PaintContext.Provider
      value={{
        canvasData,
        setCanvasData,
        history,
        setHistory,
        doHistoryAdd,
        colorData,
        setColorData,
        customColors,
        setCustomColors,
        doCustomColorsAdd,
        colorPickerData,
        setColorPickerData,
        ribbonColorsArray,
        doRibbonColorsArrayAdd,
        toolsData,
        setToolsData,
        currentTool,
        setCurrentTool
      }}
    >
      {children}
    </PaintContext.Provider>
  );
}

PaintProvider.propTypes = {
  children: PropTypes.node
};

function usePaintContext() {
  return useContext(PaintContext);
}

export {
  PaintProvider,
  usePaintContext,
};