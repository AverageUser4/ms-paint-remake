import React, { useEffect, useState } from 'react';

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

const minimal = { width: 460, height: 300 };

function PaintXPlatform() {
  const [mainWindowPosition, setMainWindowPosition] = useState({ x: 200, y: 100 });
  const [mainWindowSize, setMainWindowSize] = useState({ width: 600, height: 500 });

  const [isResizeWindowOpen, setIsResizeWindowOpen] = useState(false);
  const [isColorsWindowOpen, setIsColorsWindowOpen] = useState(true);
  
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

  const [containerTemp, setContainerTemp] = useState();
  useEffect(() => {
    if(!containerTemp) {
      const { width, height } = document.body.getBoundingClientRect();
      setContainerTemp({ width, height });
    }

    function onResize() {
      const { width, height } = document.body.getBoundingClientRect();
      setContainerTemp({ width, height });
    }

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [containerTemp]);

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
        minimal={minimal}
        // will be dimensions of user provided container
        containerDimensions={containerTemp}
        position={mainWindowPosition}
        setPosition={setMainWindowPosition}
        size={mainWindowSize}
        setSize={setMainWindowSize}
      />

      {
        isResizeWindowOpen &&
          <ResizeWindow
            containerDimensions={containerTemp}
            setIsResizeWindowOpen={setIsResizeWindowOpen}
            mainWindowPosition={mainWindowPosition}
          />
      }

      {
        isColorsWindowOpen &&
          <ColorsWindow
            containerDimensions={containerTemp}
            setIsColorsWindowOpen={setIsColorsWindowOpen}
            mainWindowPosition={mainWindowPosition}
            mainWindowSize={mainWindowSize}
          />
      }
    </div>
  );
}

export default PaintXPlatform;