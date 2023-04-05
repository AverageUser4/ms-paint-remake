import React from 'react';

import { useToolContext } from '../../context/ToolContext';

import crayon from './assets/crayon.png';
import oil from './assets/oil.png';
import pencil from './assets/pencil.png';
import watercolor from './assets/watercolor.png';

function ShapeTextures() {
  const { shapeData, currentTool } = useToolContext();

  if(!currentTool.startsWith('shape')) {
    return null;
  }

  return (
    <div style={{ display: 'none' }}>
      {
        (shapeData.outline === 'crayon' || shapeData.fill === 'crayon') &&
          <img id="pxp-texture-crayon" src={crayon}/>
      }
      {
        (shapeData.outline === 'oil' || shapeData.fill === 'oil') &&
          <img id="pxp-texture-oil" src={oil}/>
      }
      {
        (shapeData.outline === 'pencil' || shapeData.fill === 'pencil') &&
          <img id="pxp-texture-pencil" src={pencil}/>
      }
      {
        (shapeData.outline === 'watercolor' || shapeData.fill === 'watercolor') &&
          <img id="pxp-texture-watercolor" src={watercolor}/>
      }
    </div>
  );
}

export default ShapeTextures;