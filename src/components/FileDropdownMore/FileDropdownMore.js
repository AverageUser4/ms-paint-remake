import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import css from './FileDropdownMore.module.css';

import bmp32 from './assets/bmp-32.png';
import center32 from './assets/center-32.png';
import fill32 from './assets/fill-32.png';
import gif32 from './assets/gif-32.png';
import jpeg32 from './assets/jpeg-32.png';
import pageSetup32 from './assets/page-setup-32.png';
import png32 from './assets/png-32.png';
import printPreview32 from './assets/print-preview-32.png';
import tile32 from './assets/tile-32.png';
import saveAs32 from '../FileDropdown/assets/save-as-32.png';
import print32 from '../FileDropdown/assets/print-32.png';

function FileDropdownMore({ currentMore }) {
  const saveData = [
    {
      src: png32,
      heading: <><span className="head--underline">P</span>NG picture</>,
      text: 'Save a photo or drawing with high quality and use it on your computer or on the web.',
      onClick: ()=>0
    },
    {
      src: jpeg32,
      heading: <><span className="head--underline">J</span>PEG picture</>,
      text: 'Save a photo with good quality and use it on your computer, in email, or on the web.',
      onClick: ()=>0
    },
    {
      src: bmp32,
      heading: <><span className="head--underline">B</span>MP picture</>,
      text: 'Save any kind of picture with high quality and use it on your computer.',
      onClick: ()=>0
    },
    {
      src: gif32,
      heading: <><span className="head--underline">G</span>IF picture</>,
      text: 'Save a simple drawing with lower quality and use it in email or on the web.',
      onClick: ()=>0
    },
    {
      src: saveAs32,
      heading: <><span className="head--underline">O</span>ther formats</>,
      text: 'Open the Save As dialog box to select from all possible file types.',
      onClick: ()=>0
    },
  ];
  const printData = [
    {
      src: print32,
      heading: <><span className="head--underline">P</span>rint</>,
      text: 'Select a printer, number of copies, and other printing options before printing.',
      onClick: ()=>0
    },
    {
      src: pageSetup32,
      heading: <>Page <span className="head--underline">s</span>etup</>,
      text: 'Change the layout of the picture.',
      onClick: ()=>0
    },
    {
      src: printPreview32,
      heading: <>Print pre<span className="head--underline">v</span>iew</>,
      text: 'Preview and make changes before printing.',
      onClick: ()=>0
    },
  ];
  const setData = [
    {
      src: fill32,
      heading: <><span className="head--underline">F</span>ill</>,
      text: 'Fill the entire screen with the picture.',
      onClick: ()=>0
    },
    {
      src: tile32,
      heading: <><span className="head--underline">T</span>ile</>,
      text: 'Tile the picture so it repeats and fills the entire screen.',
      onClick: ()=>0
    },
    {
      src: center32,
      heading: <><span className="head--underline">C</span>enter</>,
      text: 'Center the picture in the middle of the screen.',
      onClick: ()=>0
    },
  ];

  const [moreData, setMoreData] = useState({ name: '', items: [] });

  useEffect(() => {
    switch(currentMore) {
      case 'recent':
        break;
      
      case 'save':
        if(!moreData.name.includes('Save'))
          setMoreData({
            items: saveData.map(mapItems),
            name: "Save as"
          });
        break;
  
      case 'print':
        if(!moreData.name.includes('Print'))
          setMoreData({
            items: printData.map(mapItems),
            name: "Print"
          });
        break;
  
      case 'set':
        if(!moreData.name.includes('Set'))
          setMoreData({
            items: setData.map(mapItems),
            name: "Set as desktop background"
          });
        break;
  
      default:
        console.error(`Unexpected value of "currentMore" variable, "${currentMore}".`);
    }
  });

  function mapItems(data, index) {
    return (
      <li key={index}>
        <button className={css['button']} onClick={data.onClick}>
          <img src={data.src} alt=""/>
          <div>
            <h4 className="head head--2">{data.heading}</h4>
            <p className="text text--4">{data.text}</p>
          </div>
        </button>
      </li>
    );
  }
  
  return (
    <div className={css['container']}>

      <div className={css['top']}>
        <h3 className="head">Recent pictures</h3>
      </div>

      <ul className="clean-list">

        <li>
          <button className={`${css['button']} text text--1`}><span className="text--underline">1</span>file.png</button>
        </li>

        <li>
          <button className={`${css['button']} text text--1`}><span className="text--underline">2</span>important.jpg</button>
        </li>

      </ul>

      <div className={`${css['dropdown']} ${currentMore === 'recent' ? css['dropdown--hidden'] : ''}`}>
        <div className={`${css['top']} ${css['top--alt']}`}>
          <h3 className="head">{moreData.name}</h3>
        </div>

        <ul className="clean-list">
          {moreData.items}
        </ul>
      </div>
      
    </div>
  );
}

FileDropdownMore.propTypes = {
  currentMore: PropTypes.string,
};

export default FileDropdownMore;