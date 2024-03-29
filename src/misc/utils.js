export { getAverage } from './utils/getAverage';


export function HSLtoRGB({ h, s, l }) {
  if(typeof h !== 'number' || h < 0 || h > 359)
    console.error(`Expected "h" property to be number between 0 and 359, provided:`, h);
  if(!Number.isInteger(s) || s < 0 || s > 100)      
    console.error(`Expected "s" property to be integer between 0 and 100, provided:`, s);
  if(!Number.isInteger(l) || l < 0 || l > 100)
    console.error(`Expected "l" property to be integer between 0 and 100, provided:`, l);
     
  /* https://www.30secondsofcode.org/js/s/hsl-to-rgb */
  s /= 100;
  l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

  const r = Math.round(255 * f(0));
  const g = Math.round(255 * f(8));
  const b = Math.round(255 * f(4));

  return { r, g, b };
}

export function RGBtoHSL({ r, g, b }) {
  if(!Number.isInteger(r) || r < 0 || r > 255) {
    console.error(`Expected "r" property to be integer between 0 and 255, provided:`, r);
  }
  if(!Number.isInteger(g) || g < 0 || g > 255) {
    console.error(`Expected "g" property to be integer between 0 and 255, provided:`, g);
  }
  if(!Number.isInteger(b) || b < 0 || b > 255) {
    console.error(`Expected "b" property to be integer between 0 and 255, provided:`, b);
  }

  const $r = r / 255;
  const $g = g / 255;
  const $b = b / 255;

  const Cmax = Math.max($r, $g, $b);
  const Cmin = Math.min($r, $g, $b);
  const triangle = Cmax - Cmin;

  let h, s, l;

  l = (Cmax + Cmin) / 2;
  
  if(triangle === 0) {
    h = 0;
  } else if(Cmax === $r) {
    h = 60 * (($g - $b) / triangle % 6);
  } else if(Cmax === $g) {
    h = 60 * (($b - $r) / triangle + 2);
  } else if(Cmax === $b) {
    h = 60 * (($r - $g) / triangle + 4);
  }

  if(triangle === 0) {
    s = 0;
  } else {
    s = triangle / (1 - Math.abs(2 * l - 1));
  }

  h = Math.round(h);
  if(h < 0)
    h += 360;

  s = Math.round(parseFloat(s.toFixed(2)) * 100);
  l = Math.round(parseFloat(l.toFixed(2)) * 100);

  return { h, s, l };
}

export function getWindowCenteredPosition(mainWindowPosition, mainWindowSize, innerWindowSize) {
  if(typeof mainWindowPosition?.x !== 'number' || typeof mainWindowPosition?.y !== 'number') {
    console.error(`First argument of this function should be an object containing properties: "x" (number) and "y" (number), provided:`, mainWindowPosition);
  }
  if(typeof mainWindowSize?.width !== 'number' || typeof mainWindowSize?.height !== 'number') {
    console.error(`Second argument of this function should be an object containing properties: "width" (number) and "height" (number), provided:`, mainWindowSize);
  }
  if(typeof innerWindowSize?.width !== 'number' || typeof innerWindowSize?.height !== 'number') {
    console.error(`Third argument of this function should be an object containing properties: "width" (number) and "height" (number), provided:`, innerWindowSize);
  }

  const mainWindowCenterX = mainWindowPosition.x + mainWindowSize.width / 2;
  const mainWindowCenterY = mainWindowPosition.y + mainWindowSize.height / 2;
  const x = mainWindowCenterX - innerWindowSize.width / 2;
  const y = mainWindowCenterY - innerWindowSize.height / 2;

  return { x, y };
}

export function checkArgs(args) {
  if(!Array.isArray(args)) {
    console.error(`This function takes array of object as it's only argument, provided:`, args);
  }

  for(let i = 0; i < args.length; i++) {
    const arg = args[i];
    const { anyOf } = arg;

    if(anyOf) {
      let isOk = false;
      const receivedArray = [];
      let message = 'Expected';

      for(let j = 0; j < anyOf.length; j++) {
        const arg = anyOf[j];
        const argName = Object.keys(arg).find(x => x !== 'type');

        if(typeof anyOf[j][argName] === anyOf[j].type) {
          isOk = true;
        }

        receivedArray.push({ name: argName, value: anyOf[j][argName] });
        message += ` "${argName}" to be of type "${anyOf[j].type}" or `;
      }

      if(!isOk) {
        message = message.slice(0, message.lastIndexOf(' or '));
        message += ', received:';
        console.error(message, receivedArray);
      }
    } else {
      const argName = Object.keys(arg).find(x => x !== 'type');
  
      if(typeof arg[argName] !== arg.type) {
        console.error(`Expected argument "${argName}" to be of type "${arg.type}", received:`, arg[argName]);
      }
    }

  }
}

export function hexToDec(hex) {
  hex = hex.toLowerCase();
  if(hex.match(/[^0-9a-f]/)) {
    console.error(`This function expects hexadeciamal number (consisting only of 0-9 and a-f), provided:`, hex);
  }

  const values = { a: 10, b: 11, c: 12, d: 13, e: 14, f: 15 };

  let dec = 0;
  let exponent = 0;

  for(let i = hex.length - 1; i >= 0; i--) {
    let currentDigit = parseInt(hex[i]);
    if(Number.isNaN(currentDigit)) {
      currentDigit = values[hex[i]];
    }

    dec += currentDigit * Math.pow(16, exponent);
    exponent++;
  }

  return dec;
}

export function hexToRGB(hex) {
  hex = hex.toLowerCase();
  if(
      !typeof hex === 'string' ||
      hex.lastIndexOf('#') !== 0 ||
      hex.match(/[^#0-9a-f]/)
    ) {
      console.error(`This function expects hexadecimal representation of color in this format "#xxxxxx", provided:`, hex);
    }

  const r = hexToDec(hex.slice(1, 3));
  const g = hexToDec(hex.slice(3, 5));
  const b = hexToDec(hex.slice(5, 7));

  return { r, g, b };
}

export function RGBObjectToString(obj) {
  if(typeof obj !== 'object') {
    console.error(`Expected object representing color in rgb format, provided:`, obj);
  } else if(!Number.isInteger(obj.r) || obj.r < 0 || obj.r > 255) {
    console.error(`Expected "r" property to be an integer between 0 and 255, provided:`, obj.r);
  } else if(!Number.isInteger(obj.g) || obj.g < 0 || obj.g > 255) {
    console.error(`Expected "g" property to be an integer between 0 and 255, provided:`, obj.g);
  } else if(!Number.isInteger(obj.b) || obj.b < 0 || obj.b > 255) {
    console.error(`Expected "b" property to be an integer between 0 and 255, provided:`, obj.b);
  }

  return `rgba(${obj.r}, ${obj.g}, ${obj.b}, ${obj.a || 1})`;
}

export function objectEquals(obj1, obj2, ignoredProperties = []) {
  if(!(obj1 instanceof Object)) {
    console.error(`First argument has to be an object, provided:`, obj1);
  }
  if(!(obj2 instanceof Object)) {
    console.error(`Second argument has to be an object, provided:`, obj2);
  }
  if(!Array.isArray(ignoredProperties)) {
    console.error(`Third argument has to be an array (or not provided / undefined), provided:`, ignoredProperties);
  }

  /* not good for comparing objects containing complex data types, only primitives */
  for(let key in obj1) {
    if(ignoredProperties.includes(key)) {
      continue;
    }
    if(obj1[key] !== obj2[key]) {
      return false;
    }
  }

  for(let key in obj2) {
    if(ignoredProperties.includes(key)) {
      continue;
    }
    if(obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
}

export function getCanvasCopy(canvasElement) {
  if(canvasElement.tagName !== 'CANVAS') {
    console.error(`First argument has to be a reference to a canvas element, provided:`, canvasElement);
  }
  
  const newCanvas = document.createElement('canvas');
  newCanvas.width = canvasElement.width;
  newCanvas.height = canvasElement.height;
  newCanvas.getContext('2d').drawImage(canvasElement, 0, 0);
  return newCanvas;
}

export function getRandomPointWithinCircle(originX, originY, radius) {
  if(!Number.isInteger(originX)) {
    console.error(`First argument has to be an integer, provided:`, originX);
  }
  if(!Number.isInteger(originY)) {
    console.error(`Second argument has to be an integer, provided:`, originY);
  }
  if(!Number.isInteger(radius)) {
    console.error(`Third argument has to be an integer, provided:`, radius);
  }

  /* http://jsfiddle.net/d9VRu/ */
  const angle = Math.random() * Math.PI * 2;
  const r = Math.sqrt(Math.random()) * radius;
  const x = originX + r * Math.cos(angle);
  const y = originY + r * Math.sin(angle);
  return { x: x, y: y };
}

export const ImageDataUtils = {
  _validateImageData(imageData) {
    if(!(imageData instanceof ImageData)) {
      console.error(`Expected argument to be an instance of ImageData, provided:`, imageData);
    }
  },

  _validateCoords(imageData, x, y) {
    if(!Number.isInteger(x) || x < 0 || x > imageData.width - 1) {
      console.error(`Expected argument (x) to be and integer between 0 and ${imageData.width - 1} (imageData.width - 1), provided:`, x);
    }
    if(!Number.isInteger(y) || y < 0 || y > imageData.height - 1) {
      console.error(`Expected argument (y) to be and integer between 0 and ${imageData.height - 1} (imageData.height - 1), provided:`, y);
    }
  },
  
  _validateColor(color) {
    if(typeof color !== 'object') {
      console.error(`Expected argument to be and object representing color in RGB format, provided:`, color)
    }
    if(!Number.isInteger(color.r) || color.r < 0 || color.r > 255) {
      console.error(`"r" property of color object has to be an integer between 0 and 255, provided:`, color.r);
    }
    if(!Number.isInteger(color.g) || color.g < 0 || color.g > 255) {
      console.error(`"g" property of color object has to be an integer between 0 and 255, provided:`, color.g);
    }
    if(!Number.isInteger(color.b) || color.b < 0 || color.b > 255) {
      console.error(`"b" property of color object has to be an integer between 0 and 255, provided:`, color.b);
    }
    if(Number.isInteger(color.a) && (color.a < 0 || color.b > 255)) {
      console.error(`"a" property of color object has to be and integer between 0 and 255 or anything that is not an integer (in which case it will be set to 255), provided:`, color.a);
    }
  },

  getIsCoordsValid(imageData, x, y) {
    this._validateImageData(imageData);
    return x >= 0 && x < imageData.width - 1 && y >= 0 && y < imageData.height - 1;
  },

  getIndexFromCoords(imageData, x, y) {
    this._validateImageData(imageData);
    this._validateCoords(imageData, x, y);
    return y * imageData.width * 4 + x * 4;
  },

  getColorFromCoords(imageData, x, y) {
    this._validateImageData(imageData);
    this._validateCoords(imageData, x, y);
    const index = this.getIndexFromCoords(imageData, x, y);

    return {
      r: imageData.data[index],
      g: imageData.data[index + 1],
      b: imageData.data[index + 2],
      a: imageData.data[index + 3],
    };
  },

  setColorAtCoords(imageData, x, y, color) {
    this._validateImageData(imageData);
    this._validateCoords(imageData, x, y);
    this._validateColor(color);
    const index = this.getIndexFromCoords(imageData, x, y);

    imageData.data[index] = color.r;
    imageData.data[index + 1] = color.g;
    imageData.data[index + 2] = color.b;
    imageData.data[index + 3] = Number.isInteger(color.a) ? color.a : 255;
  },

  makeColorTransparent(imageData, color) {
    this._validateImageData(imageData);
    this._validateColor(color);

    for(let y = 0; y < imageData.height; y++) {
      for(let x = 0; x < imageData.width; x++) {
        const currentColor = this.getColorFromCoords(imageData, x, y);
        if(currentColor.r === color.r && currentColor.g === color.g && currentColor.b === color.b) {
          this.setColorAtCoords(imageData, x, y, { r: 0, g: 0, b: 0, a: 0 });
        }
      }
    }
  }
};

export function getDrawData({
  pagePixel,
  secondaryRef,
  canvasZoom,
  currentPixel,
  isConstrained = false,
}) {
  if(typeof pagePixel !== 'object') {
    console.error(`"pagePixel" argument has to be an object, provided:`, pagePixel);
  }
  if(typeof secondaryRef !== 'object' || !(secondaryRef.current instanceof Element)) {
    console.error(`"secondaryRef" argument has to be a React ref object pointing to an element, provided:`), secondaryRef;
  }
  if(typeof canvasZoom !== 'number') {
    console.error(`"canvasZoom" argument has to be a number, provided:`, canvasZoom);
  }
  if(typeof currentPixel !== 'object') {
    console.error(`"currentPixel" argument has to be an object, provided:`, currentPixel);
  }
  
  const secondaryRect = secondaryRef.current.getBoundingClientRect();
  
  const destinationPixel = {
    x: Math.round((pagePixel.x - secondaryRect.x) / canvasZoom),
    y: Math.round((pagePixel.y - secondaryRect.y) / canvasZoom),
  };

  if(isConstrained) {
    destinationPixel.x = Math.max(Math.min(destinationPixel.x, Math.round(secondaryRect.width / canvasZoom) - 1), 0);
    destinationPixel.y = Math.max(Math.min(destinationPixel.y, Math.round(secondaryRect.height / canvasZoom) - 1), 0);
  }

  if(typeof currentPixel.x === 'undefined') {
    currentPixel.x = destinationPixel.x;
    currentPixel.y = destinationPixel.y;
  }
  
  const diffX = destinationPixel.x - currentPixel.x;
  const diffY = destinationPixel.y - currentPixel.y;

  const multiplier = {
    x: diffX < 0 ? -1 : 1,
    y: diffY < 0 ? -1 : 1,
  }
  
  if(Math.abs(diffX) < Math.abs(diffY)) {
    multiplier.x = multiplier.x * Math.abs(diffX / diffY);
  } else {
    multiplier.y = multiplier.y * Math.abs(diffY / diffX);
  }
  
  function doDrawLoop(doDraw, step) {
    function doCheckShouldDraw({ x, y }) {
      return Math.abs(x - destinationPixel.x) > step || Math.abs(y - destinationPixel.y) > step;
    }

    doDraw(false, !doCheckShouldDraw(currentPixel));

    while(doCheckShouldDraw(currentPixel)) {
      currentPixel.x += step * multiplier.x;
      currentPixel.y += step * multiplier.y;

      const next = {
        x: currentPixel.x + step * multiplier.x,
        y: currentPixel.y + step * multiplier.y,
      }

      doDraw(true, !doCheckShouldDraw(next));
    }
  }

  return { destinationPixel, doDrawLoop };
}

export function checkNumberValue(value, acceptNegative = false) {
  let isInvalid = false;

  if(value.startsWith('0') && value !== '0') {
    value = value.slice(1);
  }
  if(value === '') {
    value = '0';
  }
  if(
      (acceptNegative && (value.slice(0, 1).match(/[^0-9-]/) || value.slice(1).match(/[^0-9]/))) ||
      (!acceptNegative && value.match(/[^0-9]/))
    ) {
    isInvalid = true;
  }

  let numValue = parseFloat(value);
  if(Number.isNaN(numValue)) {
    numValue = 0
  }

  return {
    value,
    numValue,
    isInvalid,
  };
}

export function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}
export function setSkew(degrees) {
  return Math.tan(degreesToRadians(degrees));
}
export function getSkewedSize(width, height, degreeX, degreeY) {
  /* https://stackoverflow.com/questions/9281320/calculate-new-width-when-skewing-in-canvas */
  /* http://jsfiddle.net/LBzUt/33/ */

  degreeX = Math.abs(degreeX);
  degreeY = Math.abs(degreeY);

  const widthSkewed = setSkew(degreeX) * height;
  const heightSkewed = setSkew(degreeY) * width;

  return {
    width: Math.round(widthSkewed + (degreeX >= 0 ? width : 0)),
    height: Math.round(heightSkewed + (degreeY > 0 ? height : 0)),
  };
}

export function clamp(min, actual, max) {
  return Math.max(Math.min(actual, max), min);
}

export function writeCanvasToClipboard(canvas) {
  try {
    if(!navigator.clipboard.write) {
      throw new Error('Your browser does not seem to (fully) support Clipboard API.');
    }
  
    canvas.toBlob((blob) => {
      if(!blob) {
        throw new Error('Unable to create BLOB out of canvas.');
      }
  
      navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })])
        .catch(error => console.error('Unable to write canvas to clipboard', error));
    });
  } catch(error) {
    console.error(error);
  }
}

export function getParsedFileSize(bytes) {
  if(!Number.isInteger(bytes)) {
    console.error(`This function takes integer as its first argument, provided:`, bytes);
  }
  
  let parsedSize;

  if(bytes >= 1_000_000) {
    parsedSize = (bytes / 1_000_000).toFixed(1) + 'MB';
  } else if(bytes >= 1_000) {
    parsedSize = (bytes / 1_000).toFixed(1) + 'KB';
  } else {
    parsedSize = bytes + 'B';
  }

  return parsedSize;
}

export function getGridData(zoom) {
  const gridData = {
    cellSize: 12,
    color_1: 'rgba(0, 0, 0, 0.5)',
    color_2: 'rgba(255, 255, 255, 0.5)',
  };

  if(zoom >= 0.5) {
    gridData.cellSize = 10;
  }
  if(zoom === 3) {
    gridData.cellSize = 15;
  }
  if(zoom >= 4) {
    gridData.cellSize = zoom;
    gridData.color_1 = 'rgb(192, 192, 192)';
    gridData.color_2 = 'rgb(128, 128, 128)';
  }

  return gridData;
}