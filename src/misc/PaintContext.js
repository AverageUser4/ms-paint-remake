import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { HSLtoRGB, objectEquals, RGBObjectToString } from "../misc/utils";

const zoomData = [
  { multiplier: 0.125, offset: 7 },
  { multiplier: 0.25, offset: 12 },
  { multiplier: 0.50, offset: 23 },
  { multiplier: 1, offset: 45 },
  { multiplier: 2, offset: 51 },
  { multiplier: 3, offset: 57 },
  { multiplier: 4, offset: 63 },
  { multiplier: 5, offset: 68 },
  { multiplier: 6, offset: 73 },
  { multiplier: 7, offset: 78 },
  { multiplier: 8, offset: 83 },
];

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
    primary: { r: 0, g: 0, b: 0 },
    secondary: { r: 255, g: 255, b: 255 },
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
        draw({ secondaryContext, curX, curY }) {
          const size = this.sizes[this.chosenSizeIndex];
          
          if(size <= 2) {
            secondaryContext.fillRect(curX, curY, size, size);
          } else if(size === 3) {
            secondaryContext.fillRect(curX - 1, curY, 3, 1);
            secondaryContext.fillRect(curX, curY - 1, 1, 3);
          } else if(size === 4) {
            secondaryContext.fillRect(curX - 1, curY, 4, 2);
            secondaryContext.fillRect(curX, curY - 1, 2, 4);
          }
        },
      },
    ],
    [
      'fill',
      {
        sizes: null,
        onPointerDown({ event, primaryContext, canvasSize, currentZoom, colorData }) {
          const { width, height } = canvasSize;
          let { offsetX, offsetY } = event.nativeEvent;
          offsetX = Math.round(offsetX / currentZoom);
          offsetY = Math.round(offsetY / currentZoom);
          const imageData = primaryContext.getImageData(0, 0, width, height);
          const color = event.button === 0 ? colorData.primary : colorData.secondary;

          function getIndexFromCoords(x, y) {
            return y * width * 4 + x * 4;
          }

          function getDataFromCoords(x, y) {
            const index = getIndexFromCoords(x, y);
            return {
              r: imageData.data[index],
              g: imageData.data[index + 1],
              b: imageData.data[index + 2],
              a: imageData.data[index + 3],
            };
          }

          function setPixelAtCoords(x, y) {
            const index = getIndexFromCoords(x, y);
            imageData.data[index] = color.r;
            imageData.data[index + 1] = color.g;
            imageData.data[index + 2] = color.b;
            imageData.data[index + 3] = 255;
          }

          function isSameColor(a, b) {
            return a.r === b.r && a.g === b.g && a.b === b.b;
          }
          
          const clickedColor = getDataFromCoords(offsetX, offsetY);
          let recursionTimes = 0;

          function checkAndChange(offsetX, offsetY) {
            const currentColor = getDataFromCoords(offsetX, offsetY);
            if(!isSameColor(clickedColor, currentColor) || ++recursionTimes > 10000) {
              return;
            }

            setPixelAtCoords(offsetX, offsetY);
            checkAndChange(offsetX - 1, offsetY);
            checkAndChange(offsetX + 1, offsetY);
            checkAndChange(offsetX, offsetY - 1);
            checkAndChange(offsetX, offsetY + 1);
          }

          checkAndChange(offsetX, offsetY);

          primaryContext.putImageData(imageData, 0, 0);
        }
      },
    ],
    [
      'text',
      {
        sizes: null,
        draw({ secondaryContext, curX, curY }) {
          const size = this.sizes[this.chosenSizeIndex];
          
          if(size <= 2) {
            secondaryContext.fillRect(curX, curY, size, size);
          } else if(size === 3) {
            secondaryContext.fillRect(curX - 1, curY, 3, 1);
            secondaryContext.fillRect(curX, curY - 1, 1, 3);
          } else if(size === 4) {
            secondaryContext.fillRect(curX - 1, curY, 4, 2);
            secondaryContext.fillRect(curX, curY - 1, 2, 4);
          }
        },
      },
    ],
    [
      'eraser',
      {
        sizes: [4, 6, 8, 10],
        chosenSizeIndex: 2,
        draw({ primaryContext, secondaryContext, curX, curY, currentlyPressed, color }) {
          const size = this.sizes[this.chosenSizeIndex];
          const startX = curX - size / 2;
          const startY = curY - size / 2;

          if(currentlyPressed === 0) {
            secondaryContext.fillStyle = RGBObjectToString(color.secondary);
            secondaryContext.fillRect(startX, startY, size, size);
          } else {
            const square = primaryContext.getImageData(startX, startY, size, size);
            for(let i = 0; i < square.data.length; i += 4) {
              const sR = square.data[i];
              const sG = square.data[i + 1];
              const sB = square.data[i + 2];
              const sA = square.data[i + 3];
              const { r, g, b } = color.primary;

              if(sR === r && sG === g && sB === b && sA === 255) {
                const { r, g, b } = color.secondary;
                square.data[i] = r;
                square.data[i + 1] = g;
                square.data[i + 2] = b;
              }
            }
            secondaryContext.putImageData(square, startX, startY);
          }
        },
      },
    ],
    [
      'color-picker',
      {
        sizes: null,
        onPointerDown({ event, primaryContext, currentZoom }) {
          const { offsetX, offsetY } = event.nativeEvent;
          const data = primaryContext.getImageData(Math.round(offsetX / currentZoom), Math.round(offsetY / currentZoom), 1, 1);
          const RGB = { r: data.data[0], g: data.data[1], b: data.data[2] };
          if(event.button === 0) {
            setColorData(prev => ({ ...prev, primary: RGB }));
          } else if(event.button === 2) {
            setColorData(prev => ({ ...prev, secondary: RGB }));
          }
        }
      },
    ],
    [
      'magnifier',
      {
        sizes: null,
        onPointerDown({ event, currentZoom }) {
          const currentZoomIndex = zoomData.findIndex(data => data.multiplier === currentZoom);
          if(event.button === 2 && currentZoomIndex > 0) {
            setCanvasData(prev => ({ ...prev, zoom: zoomData[currentZoomIndex - 1].multiplier }));
          } else if(event.button === 0 && currentZoomIndex < zoomData.length - 1) {
            setCanvasData(prev => ({ ...prev, zoom: zoomData[currentZoomIndex + 1].multiplier }));
          }
        }
      },
    ],

    /* brushes */
    [
      'brushes-brush',
      {
        sizes: [1, 3, 5, 8],
        chosenSizeIndex: 1,
        draw({ secondaryContext, curX, curY }) {
          const size = this.sizes[this.chosenSizeIndex];

          secondaryContext.beginPath();
          secondaryContext.arc(curX, curY, size, 0, Math.PI * 2);
          secondaryContext.fill();
        },
      },
    ],
    [
      'brushes-calligraphy-1',
      {
        sizes: [3, 5, 8, 10],
        chosenSizeIndex: 1,
        draw({ secondaryContext, curX, curY }) {
          const size = this.sizes[this.chosenSizeIndex];

          if(size === 3) {
            secondaryContext.fillRect(curX - 1, curY + 1, 2, 1);
            secondaryContext.fillRect(curX, curY, 2, 1);
            secondaryContext.fillRect(curX + 1, curY - 1, 2, 1);
          } else if(size === 5) {
            secondaryContext.fillRect(curX - 2, curY + 2, 2, 1);
            secondaryContext.fillRect(curX - 1, curY + 1, 2, 1);
            secondaryContext.fillRect(curX, curY, 2, 1);
            secondaryContext.fillRect(curX + 1, curY - 1, 2, 1);
            secondaryContext.fillRect(curX + 2, curY - 2, 2, 1);
          } else if(size === 8) {
            secondaryContext.fillRect(curX - 4, curY + 4, 2, 1);
            secondaryContext.fillRect(curX - 3, curY + 3, 2, 1);
            secondaryContext.fillRect(curX - 2, curY + 2, 2, 1);
            secondaryContext.fillRect(curX - 1, curY + 1, 2, 1);
            secondaryContext.fillRect(curX, curY, 2, 1);
            secondaryContext.fillRect(curX + 1, curY - 1, 2, 1);
            secondaryContext.fillRect(curX + 2, curY - 2, 2, 1);
            secondaryContext.fillRect(curX + 3, curY - 3, 2, 1);
          } else if(size === 10) {
            secondaryContext.fillRect(curX - 5, curY + 5, 2, 1);
            secondaryContext.fillRect(curX - 4, curY + 4, 2, 1);
            secondaryContext.fillRect(curX - 3, curY + 3, 2, 1);
            secondaryContext.fillRect(curX - 2, curY + 2, 2, 1);
            secondaryContext.fillRect(curX - 1, curY + 1, 2, 1);
            secondaryContext.fillRect(curX, curY, 2, 1);
            secondaryContext.fillRect(curX + 1, curY - 1, 2, 1);
            secondaryContext.fillRect(curX + 2, curY - 2, 2, 1);
            secondaryContext.fillRect(curX + 3, curY - 3, 2, 1);
            secondaryContext.fillRect(curX + 4, curY - 4, 2, 1);
          }
        },
      },
    ],
    [
      'brushes-calligraphy-2',
      {
        sizes: [3, 5, 8, 10],
        chosenSizeIndex: 1,
        draw({ secondaryContext, curX, curY }) {
          const size = this.sizes[this.chosenSizeIndex];

          if(size === 3) {
            secondaryContext.fillRect(curX - 1, curY - 1, 2, 1);
            secondaryContext.fillRect(curX, curY, 2, 1);
            secondaryContext.fillRect(curX + 1, curY + 1, 2, 1);
          } else if(size === 5) {
            secondaryContext.fillRect(curX - 2, curY - 2, 2, 1);
            secondaryContext.fillRect(curX - 1, curY - 1, 2, 1);
            secondaryContext.fillRect(curX, curY, 2, 1);
            secondaryContext.fillRect(curX + 1, curY + 1, 2, 1);
            secondaryContext.fillRect(curX + 2, curY + 2, 2, 1);
          } else if(size === 8) {
            secondaryContext.fillRect(curX - 4, curY - 4, 2, 1);
            secondaryContext.fillRect(curX - 3, curY - 3, 2, 1);
            secondaryContext.fillRect(curX - 2, curY - 2, 2, 1);
            secondaryContext.fillRect(curX - 1, curY - 1, 2, 1);
            secondaryContext.fillRect(curX, curY, 2, 1);
            secondaryContext.fillRect(curX + 1, curY + 1, 2, 1);
            secondaryContext.fillRect(curX + 2, curY + 2, 2, 1);
            secondaryContext.fillRect(curX + 3, curY + 3, 2, 1);
          } else if(size === 10) {
            secondaryContext.fillRect(curX - 5, curY - 5, 2, 1);
            secondaryContext.fillRect(curX - 4, curY - 4, 2, 1);
            secondaryContext.fillRect(curX - 3, curY - 3, 2, 1);
            secondaryContext.fillRect(curX - 2, curY - 2, 2, 1);
            secondaryContext.fillRect(curX - 1, curY - 1, 2, 1);
            secondaryContext.fillRect(curX, curY, 2, 1);
            secondaryContext.fillRect(curX + 1, curY + 1, 2, 1);
            secondaryContext.fillRect(curX + 2, curY + 2, 2, 1);
            secondaryContext.fillRect(curX + 3, curY + 3, 2, 1);
            secondaryContext.fillRect(curX + 4, curY + 4, 2, 1);
          }
        },
      },
    ],
    [
      'brushes-airbrush',
      {
        sizes: [4, 8, 16, 24],
        chosenSizeIndex: 1,
        draw({ secondaryContext, curX, curY }) {
          const size = this.sizes[this.chosenSizeIndex];

          function drawRandomPoints() {
            for(let i = 0; i < size; i++) {
              const { x: randX, y: randY } = calculatePoint(curX, curY, size);
              secondaryContext.fillRect(Math.round(randX), Math.round(randY), 1, 1);
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
        draw({ secondaryContext, curX, curY }) {
          /* TODO: add unique implementation */
          const size = this.sizes[this.chosenSizeIndex];

          secondaryContext.beginPath();
          secondaryContext.arc(curX, curY, size, 0, Math.PI * 2);
          secondaryContext.fill();
        },
      },
    ],
    [
      'brushes-crayon',
      {
        sizes: [8, 16, 30, 40],
        chosenSizeIndex: 1,
        draw({ secondaryContext, curX, curY }) {
          /* TODO: add unique implementation */
          const size = this.sizes[this.chosenSizeIndex];

          secondaryContext.beginPath();
          secondaryContext.arc(curX, curY, size, 0, Math.PI * 2);
          secondaryContext.fill();
        },
      },
    ],
    [
      'brushes-marker',
      {
        sizes: [8, 16, 30, 40],
        chosenSizeIndex: 1,
        draw({ secondaryContext, curX, curY }) {
          /* TODO: add unique implementation */
          const size = this.sizes[this.chosenSizeIndex];

          secondaryContext.beginPath();
          secondaryContext.arc(curX, curY, size, 0, Math.PI * 2);
          secondaryContext.fill();
        },
      },
    ],
    [
      'brushes-natural-pencil',
      {
        sizes: [8, 16, 30, 40],
        chosenSizeIndex: 1,
        draw({ secondaryContext, curX, curY }) {
          /* TODO: add unique implementation */
          const size = this.sizes[this.chosenSizeIndex];

          secondaryContext.beginPath();
          secondaryContext.arc(curX, curY, size, 0, Math.PI * 2);
          secondaryContext.fill();
        },
      },
    ],
    [
      'brushes-watercolor',
      {
        sizes: [8, 16, 30, 40],
        chosenSizeIndex: 1,
        draw({ secondaryContext, curX, curY }) {
          /* TODO: add unique implementation */
          const size = this.sizes[this.chosenSizeIndex];

          secondaryContext.beginPath();
          secondaryContext.arc(curX, curY, size, 0, Math.PI * 2);
          secondaryContext.fill();
        },
      },
    ],

    /* selection */
    [
      'selection-rectangle',
      {
        sizes: null,
        onPointerDown({ event }) {
          console.log('hi')
        },
        onPointerMove({ event }) {
          console.log('hello')
        }
      },
    ],
  ]));
  const [currentTool, setCurrentTool] = useState('selection-rectangle');
  const [latestTools, setLatestTools] = useState({ brushes: 'brushes-brush' });
  function doSetCurrentTool(tool) {
    if(currentTool.startsWith('brushes')) {
      setLatestTools(prev => ({ ...prev, brushes: currentTool }));
    }
    setCurrentTool(tool);
  }
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
        setCurrentTool,
        doSetCurrentTool,
        latestTools
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
  zoomData
};