import React from "react";
import css from './Ribbon.module.css';
import Clipboard from '../Clipboard/Clipboard';

function Ribbon() {
  return (
    <div className={css['container']}>
      <Clipboard/>
      <Clipboard/>
      <Clipboard/>
    </div>
  );
}

export default Ribbon;