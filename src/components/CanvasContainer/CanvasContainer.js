import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import css from './CanvasContainer.module.css';

import Canvas from '../Canvas/Canvas';
import Rulers from '../Rulers/Rulers';
import { useWindowsContext } from '../../misc/WindowsContext';

function CanvasContainer({ toolbarData, ribbonData }) {
  const { isStatusBarVisible, isRulersVisible } = useWindowsContext();
  const canvasContainerRef = useRef();
  
  const containerStyle = {
    height: `calc(
      100%
      ${!ribbonData.minimize ? '- var(--ribbon-height)' : ''}
      - var(--ribbon-controls-height)
      - var(--topbar-height)
      ${isStatusBarVisible ? '- var(--statusbar-height)' : ''}
      ${toolbarData.reposition ? '- var(--qa-toolbar-height)' : ''}
      ${isRulersVisible ? '- var(--rulers-size)' : ''}
    )`
  };

  return (
    <div 
      className={`
        ${css['container']}
        ${isRulersVisible && css['container--has-rulers']}
      `}
      style={containerStyle}
    >
      <Rulers/>
      <div 
        className={css['canvas-container']}
        ref={canvasContainerRef}
      >
        <Canvas/>
      </div>
    </div>
  );
}

CanvasContainer.propTypes = {
  ribbonData: PropTypes.object.isRequired,
  toolbarData: PropTypes.object.isRequired,
};

export default CanvasContainer;