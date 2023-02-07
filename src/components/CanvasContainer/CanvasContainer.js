import React from 'react';
import PropTypes from 'prop-types';
import css from './CanvasContainer.module.css';

function CanvasContainer({ repositionToolbar }) {
  const style = {
    height: `calc(
      100%
      - var(--ribbon-height)
      - var(--ribbon-controls-height)
      - var(--topbar-height)
      - var(--bottombar-height)
      ${repositionToolbar ? '- var(--qa-toolbar-height)' : ''}
    )`
  };

  return (
    <div style={style} className={css['container']}>

    </div>
  );
}

CanvasContainer.propTypes = {
  repositionToolbar: PropTypes.bool
}

export default CanvasContainer;