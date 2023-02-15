import React from 'react';
import PropTypes from 'prop-types';
import css from './ResizeWindow.module.css';

import Window from '../Window/Window';
import InnerWindowTopBar from '../InnerWindowTopBar/InnerWindowTopBar';

// spawned at 40, 80 from the origin of the main window

function ResizeWindow({ containerWidth, containerHeight }) {
  const items = [
    {
      Component: InnerWindowTopBar, 
      props: {
        text: 'Resize and Skew'
      }
    },
  ];

  console.log(containerWidth, containerHeight)

  return (
    <Window
      items={items}
      isResizable={false}
      initialWidth={280}
      initialHeight="auto"
      initialX={40}
      initialY={80}
      isInnerWindow={true}
      containerWidth={containerWidth}
      containerHeight={containerHeight}
      isConstrained={false}
    >
      <article className={css['container']}>
        hello, i am resize window!
      </article>
    </Window>
  );
}

ResizeWindow.propTypes = {
  containerWidth: PropTypes.number,
  containerHeight: PropTypes.number,
};

export default ResizeWindow;