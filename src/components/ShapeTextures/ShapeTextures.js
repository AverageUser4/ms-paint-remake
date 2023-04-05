import React from 'react';

import { useToolContext } from '../../context/ToolContext';

import crayon from './assets/crayon.png';
import oil from './assets/oil.png';
import pencil from './assets/pencil.png';
import watercolor from './assets/watercolor.png';

function ShapeTextures() {
  const { currentTool } = useToolContext();

  if(!currentTool.startsWith('shape')) {
    return null;
  }

  return (
    <div style={{ display: 'none' }}>
      <img id="pxp-texture-crayon" src={crayon}/>
      <img id="pxp-texture-oil" src={oil}/>
      <img id="pxp-texture-pencil" src={pencil}/>
      <img id="pxp-texture-watercolor" src={watercolor}/>
    </div>
  );
}

export default ShapeTextures;