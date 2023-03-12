import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import css from './CanvasContainer.module.css';

import Canvas from '../Canvas/Canvas';
import Rulers from '../Rulers/Rulers';
import { useWindowsContext } from '../../misc/WindowsContext';
import { useCanvasContext } from '../../misc/CanvasContext';

function CanvasContainer({ toolbarData, ribbonData }) {
  // called so it rerenders when canvas size changes
  useCanvasContext();
  const { isStatusBarVisible, isRulersVisible } = useWindowsContext();
  const containerRef = useRef();
  
  const containerStyle = {
    height: `calc(
      100%
      ${!ribbonData.minimize ? '- var(--ribbon-height)' : ''}
      - var(--ribbon-controls-height)
      - var(--topbar-height)
      ${isStatusBarVisible ? '- var(--statusbar-height)' : ''}
      ${toolbarData.reposition ? '- var(--qa-toolbar-height)' : ''}
    )`
  };

  return (
    <div 
      className={`
        ${css['container']}
        ${isRulersVisible && css['container--has-rulers']}
      `}
      ref={containerRef}
      style={containerStyle}
    >
      {isRulersVisible && <Rulers/>}
      <Canvas/>
    </div>
  );
}

CanvasContainer.propTypes = {
  ribbonData: PropTypes.object.isRequired,
  toolbarData: PropTypes.object.isRequired,
};

export default CanvasContainer;