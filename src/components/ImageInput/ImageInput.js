import React from 'react';
import PropTypes from 'prop-types';

import { useCanvasContext } from '../../context/CanvasContext';

function ImageInput({ inputRef, onLoad, isSetFileData }) {
  const { setFileData } = useCanvasContext();
  
  return (
    <input 
      type="file"
      ref={inputRef}
      style={{ display: 'none' }}
      onChange={(event) => {
        const image = new Image();
        const file = event.target.files[0];

        // don't destructure, properties of this object are not enumerable
        if(isSetFileData && file.type.includes('image/')) {
          setFileData({ 
            name: file.name, size: file.size,
            lastModified: file.lastModified, type: file.type
          });
        } else if(isSetFileData) {
          setFileData(null);
        }

        image.src = URL.createObjectURL(file);
        image.addEventListener('load', onLoad);
        image.addEventListener('error', () => {
          console.error('de_Provided file does not appear to be an image.');
        });
      }}
    />
  );
}

ImageInput.propTypes = {
  inputRef: PropTypes.object.isRequired,
  onLoad: PropTypes.func.isRequired,
  isSetFileData: PropTypes.bool,
};

export default ImageInput;
