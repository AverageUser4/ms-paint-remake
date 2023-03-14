import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { HSLtoRGB, objectEquals } from "../misc/utils";

const initialCustomColors = [];
for(let i = 0; i < 16; i ++) {
  initialCustomColors.push({ r: 255, g: 255, b: 255 });
}

const ColorContext = createContext();

function ColorProvider({ children }) {
  const [colorData, setColorData] = useState({
    primary: { r: 0, g: 0, b: 0 },
    secondary: { r: 255, g: 255, b: 255 },
    selected: 'primary'
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

  return (
    <ColorContext.Provider
      value={{
        colorData,
        setColorData,
        customColors,
        setCustomColors,
        doCustomColorsAdd,
        colorPickerData,
        setColorPickerData,
        ribbonColorsArray,
        doRibbonColorsArrayAdd,
      }}
    >
      {children}
    </ColorContext.Provider>
  );
}

ColorProvider.propTypes = {
  children: PropTypes.node.isRequired
};

function useColorContext() {
  return useContext(ColorContext);
}

export {
  ColorProvider,
  useColorContext,
};