import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import css from './CanvasContainer.module.css';

import Canvas from '../Canvas/Canvas';
import { useSelectionContext } from '../../misc/SelectionContext';

function CanvasContainer({ toolbarData, ribbonData }) {
  const { selectionPhase, setSelectionPhase } = useSelectionContext();
  const containerRef = useRef();
  
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
    <div 
      style={style} 
      className={css['container']}
      ref={containerRef}
      // onClick={(e) => {
      //   console.log(e.target)
      //   if(e.target !== containerRef.current) {
      //     return;
      //   }
      //   if(selectionPhase > 0) {
      //     setSelectionPhase(0);
      //   }
      // }}
    >
      <Canvas/>
    </div>
  );
}

CanvasContainer.propTypes = {
  ribbonData: PropTypes.object.isRequired,
  toolbarData: PropTypes.object.isRequired,
};

export default CanvasContainer;