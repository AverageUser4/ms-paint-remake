import React, { useState } from 'react';
import css from './FileDropdown.module.css';

import FileDropdownMore from '../FileDropdownMore/FileDropdownMore';

import about32 from './assets/about-32.png';
import bmp32 from './assets/bmp-32.png';
import center32 from './assets/center-32.png';
import email32 from './assets/email-32.png';
import exit32 from './assets/exit-32.png';
import fill32 from './assets/fill-32.png';
import gif32 from './assets/gif-32.png';
import jpeg32 from './assets/jpeg-32.png';
import new32 from './assets/new-32.png';
import open32 from './assets/open-32.png';
import pageSetup32 from './assets/page-setup-32.png';
import png32 from './assets/png-32.png';
import print32 from './assets/print-32.png';
import printPreview32 from './assets/print-preview-32.png';
import properties32 from './assets/properties-32.png';
import save32 from './assets/save-32.png';
import saveAs32 from './assets/save-as-32.png';
import scanner32 from './assets/scanner-32.png';
import set32 from './assets/set-32.png';
import tile32 from './assets/tile-32.png';
import { ReactComponent as ArrowRight } from '../../assets/global/arrow-right.svg';

function FileDropdown() {
  const [currentMore, setCurrentMore] = useState('recent');
  
  return (
    <div className={css['container']}>

      <div className={css['top']}>
        <button className="ribbon-button ribbon-button--blue">File</button>
      </div>

      <div className={css['middle']}>
        <div className={css['left']}>

          <button className={css['button']}>
            <img src={new32} alt=""/>
            <span className="text text--1"><span className="text--underline">N</span>ew</span>
          </button>

          <button className={css['button']}>
            <img src={open32} alt=""/>
            <span className="text text--1"><span className="text--underline">O</span>pen</span>
          </button>

          <button className={css['button']}>
            <img src={save32} alt=""/>
            <span className="text text--1"><span className="text--underline">S</span>ave</span>
          </button>

          <div className={css['duo-container']}>
            <button className={css['button']}>
              <img src={saveAs32} alt=""/>
              <span className="text text--1">Save <span className="text--underline">a</span>s</span>
            </button>

            <button className={css['arrow-button']}>
              <ArrowRight/>
            </button>
          </div>

          <div className={css['border']}></div>

          <div className={css['duo-container']}>
            <button className={css['button']}>
              <img src={print32} alt=""/>
              <span className="text text--1"><span className="text--underline">P</span>rint</span>
            </button>

            <button className={css['arrow-button']}>
              <ArrowRight/>
            </button>
          </div>
          
          <button className={css['button']}>
            <img src={scanner32} alt=""/>
            <span className="text text--1">Fro<span className="text--underline">m</span> scanner or camera</span>
          </button>

          <button className={css['button']}>
            <img src={email32} alt=""/>
            <span className="text text--1">Sen<span className="text--underline">d</span> in email</span>
          </button>

          <div className={css['border']}></div>

          <div className={css['duo-container']}>
            <button className={css['button']}>
              <img src={set32} alt=""/>
              <span className="text text--1">Set as desktop <span className="text--underline">b</span>ackground</span>
            </button>

            <button className={css['arrow-button']}>
              <ArrowRight/>
            </button>
          </div>

          <div className={css['border']}></div>

          <button className={css['button']}>
            <img src={properties32} alt=""/>
            <span className="text text--1">Prop<span className="text--underline">e</span>rties</span>
          </button>

          <div className={css['border']}></div>

          <button className={css['button']}>
            <img src={about32} alt=""/>
            <span className="text text--1">Abou<span className="text--underline">t</span> paint</span>
          </button>

          <div className={css['border']}></div>

          <button className={css['button']}>
            <img src={set32} alt=""/>
            <span className="text text--1">E<span className="text--underline">x</span>it</span>
          </button>

        </div>
        
        <div className={css['right']}>
          <FileDropdownMore currentMore={currentMore}/>
        </div>
      </div>

      <div className={css['bottom']}></div>

    </div>
  );
}

export default FileDropdown;