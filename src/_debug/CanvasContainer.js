import React from 'react';
import PropTypes from 'prop-types';
import css from './CanvasContainer.module.css';

import Canvas from '../Canvas/Canvas';

function CanvasContainer({ toolbarData, ribbonData, canvasData, setCanvasData }) {
  const style = {
    height: `calc(
      100%
      ${!ribbonData.minimize ? '- var(--ribbon-height)' : ''}
      - var(--ribbon-controls-height)
      - var(--topbar-height)
      - var(--bottombar-height)
      ${toolbarData.reposition ? '- var(--qa-toolbar-height)' : ''}
    )`
  };

  return (
    <div style={style} className={css['container']}>
      <Canvas
        canvasData={canvasData}
        setCanvasData={setCanvasData}
      />
    </div>
  );
}

CanvasContainer.propTypes = {
  ribbonData: PropTypes.object.isRequired,
  toolbarData: PropTypes.object.isRequired,
  canvasData: PropTypes.object.isRequired,
  setCanvasData: PropTypes.func.isRequired,
}

export default CanvasContainer;