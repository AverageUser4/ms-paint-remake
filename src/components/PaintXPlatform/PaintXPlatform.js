import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Window from '../Window/Window';
import CanvasContainer from '../CanvasContainer/CanvasContainer';
import Ribbon from '../Ribbon/Ribbon';
import RibbonControls from '../RibbonControls/RibbonControls';
import TopBar from '../TopBar/TopBar';
import BottomBar from '../BottomBar/BottomBar';
import QuickAccessToolbar from '../QuickAccessToolbar/QuickAccessToolbar';
import ContextMenu from '../ContextMenu/ContextMenu';
import ResizeWindow from '../ResizeWindow/ResizeWindow';
import ColorsWindow from '../ColorsWindow/ColorsWindow';
import { ContextMenuProvider } from '../../misc/ContextMenuContext';

function Logic({ 
  containerRef,
  initialPosition = { x: 200, y: 100 },
  initialSize = { width: 600, height: 500 },
  minimalSize = { width: 460, height: 300 },
  isResizable = true,
  isConstrained = true,
  isAutoShrink = true,
  isAutoFit = true,
}) {

  const [mainWindowPosition, setMainWindowPosition] = useState({ x: 200, y: 100 });
  const [mainWindowSize, setMainWindowSize] = useState({ width: 600, height: 500 });

  const [isResizeWindowOpen, setIsResizeWindowOpen] = useState(false);
  const [isColorsWindowOpen, setIsColorsWindowOpen] = useState(false);
  
  const [toolbarData, setToolbarData] = useState({ reposition: false, buttons: ['save', 'undo', 'redo'] });

  const [ribbonData, setRibbonData] = useState({ 
    minimize: false,
    activeTab: 'home',
    expand: false,
    toggleMinimize: () => setRibbonData(prev => ({ ...prev, minimize: !prev.minimize, expand: false })),
    stopExpanding: () => setRibbonData(prev => ({ ...prev, expand: false })),
    // uses setTimeout so it does not get closed immediately after being open due to event listener on window
    setTab: (tabName) => setTimeout(() => setRibbonData(prev => ({ ...prev, activeTab: tabName, expand: true })))
  });
  
  const [canvasData, setCanvasData] = useState({
    mousePosition: null,
    size: { width: 300, height: 200 },
    outlineSize: null,
  });

  const [containerDimensions, setContainerDimensions] = useState();
  useEffect(() => {
    if(!containerRef.current)
      return;

    if(!containerDimensions) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setContainerDimensions({ width, height });
    }

    function onResize() {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setContainerDimensions({ width, height });
    }

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [containerDimensions, containerRef]);

  const items = [
    {
      Component: TopBar, 
      props: { 
        toolbarData,
        setToolbarData,
        ribbonData,
      }
    },
    { 
      Component: RibbonControls,
      props: { 
        ribbonData,
      }
    },
    { 
      Component: Ribbon,
      props: { 
        ribbonData,
        setIsResizeWindowOpen,
        setIsColorsWindowOpen,
      }
    },
    (
      toolbarData.reposition ?
        { 
          Component: QuickAccessToolbar,
          props: { 
            toolbarData,
            setToolbarData,
            ribbonData,
          }
        }
      :
        null
    ),
    { 
      Component: CanvasContainer,
      props: { 
        toolbarData,
        ribbonData,
        canvasData,
        setCanvasData
      }
    },
    { 
      Component: BottomBar,
      props: { 
        canvasData 
      } 
    },
    {
      Component: ContextMenu,
      props: {}
    },
  ];

  return (
    <div 
      onContextMenu={(e) => e.preventDefault()}
    >
      <Window 
        items={items}
        minimal={minimalSize}
        containerDimensions={containerDimensions}
        position={mainWindowPosition}
        setPosition={setMainWindowPosition}
        size={mainWindowSize}
        setSize={setMainWindowSize}
        isResizable={isResizable}
        isConstrained={isConstrained}
        isAutoFit={isAutoFit}
        isAutoShrink={isAutoShrink}
      />

      {
        isResizeWindowOpen &&
          <ResizeWindow
            containerDimensions={containerDimensions}
            setIsResizeWindowOpen={setIsResizeWindowOpen}
            mainWindowPosition={mainWindowPosition}
          />
      }

      {
        isColorsWindowOpen &&
          <ColorsWindow
            containerDimensions={containerDimensions}
            setIsColorsWindowOpen={setIsColorsWindowOpen}
            mainWindowPosition={mainWindowPosition}
            mainWindowSize={mainWindowSize}
          />
      }
    </div>
  );
}

Logic.propTypes = {
  containerRef: PropTypes.object.isRequired,
  initialPosition: PropTypes.shape({ x: PropTypes.number.isRequired, y: PropTypes.number.isRequired }),
  initialSize: PropTypes.shape({ width: PropTypes.number.isRequired, height: PropTypes.number.isRequired }),
  minimalSize: PropTypes.shape({ width: PropTypes.number.isRequired, height: PropTypes.number.isRequired }),
  isResizable: PropTypes.bool,
  isConstrained: PropTypes.bool,
  isAutoShrink: PropTypes.bool,
  isAutoFit: PropTypes.bool,
};

function PaintXPlatform(props) {
  return (
    <ContextMenuProvider>
      <Logic {...props}/>
    </ContextMenuProvider>
  );
}

export default PaintXPlatform;