import React, { useState } from 'react';

import Window from '../Window/Window';
import CanvasContainer from '../CanvasContainer/CanvasContainer';
import Ribbon from '../Ribbon/Ribbon';
import RibbonControls from '../RibbonControls/RibbonControls';
import TopBar from '../TopBar/TopBar';
import BottomBar from '../BottomBar/BottomBar';
import QuickAccessToolbar from '../QuickAccessToolbar/QuickAccessToolbar';

function PaintXPlatform() {
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
        ribbonData
      }
    },
    { 
      Component: BottomBar,
      props: {} 
    }
  ];

  return (
    <Window 
      items={items}
      minWidth={460}
      minHeight={300}
    />
  );
}

export default PaintXPlatform;