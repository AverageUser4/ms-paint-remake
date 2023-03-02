export function toggleBoolState(isOn, setIsOn) {
  if(isOn)
    setIsOn(false);
  else
    setTimeout(() => setIsOn(true));
}

export function HSLtoRGB({ h, s, l }) {
  if(typeof h !== 'number' || h < 0 || h > 359)
    console.error(`Incorrect "h" provided, expected number between 0 and 359, received: "${h}".`);
  if(!Number.isInteger(s) || s < 0 || s > 100)      
    console.error(`Incorrect "s" provided, expected integer between 0 and 100, received: "${s}".`);
  if(!Number.isInteger(l) || l < 0 || l > 100)
    console.error(`Incorrect "l" provided, expected integer between 0 and 100, received: "${l}".`);
     
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
  if(!Number.isInteger(r) || r < 0 || r > 255)
    console.error(`Incorrect "r" provided, expected integer between 0 and 255, received: "${r}".`);
  if(!Number.isInteger(g) || g < 0 || g > 255)
    console.error(`Incorrect "g" provided, expected integer between 0 and 255, received: "${g}".`);
  if(!Number.isInteger(b) || b < 0 || b > 255)
    console.error(`Incorrect "b" provided, expected integer between 0 and 255, received: "${b}".`);

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

export function getWindowCenteredPosition(mainWindowPosition, mainWindowSize, size) {
  const mainWindowCenterX = mainWindowPosition.x + mainWindowSize.width / 2;
  const mainWindowCenterY = mainWindowPosition.y + mainWindowSize.height / 2;
  const x = mainWindowCenterX - size.width / 2;
  const y = mainWindowCenterY - size.height / 2;

  return { x, y };
}

export function checkArgs(args) {
  if(!Array.isArray(args)) {
    throw new Error(`${checkArgs.name} function takes array of object as it's only argument.`);
  }

  for(let i = 0; i < args.length; i++) {
    const arg = args[i];
    if(typeof arg.value !== arg.type) {
      console.error(`Argument ${arg.name} has value ${arg.value} of type ${typeof arg.value}, while expected type is ${arg.type}`);
    }
  }
}

export function hexToDec(hex) {
  hex = hex.toLowerCase();
  if(hex.match(/[^0-9a-f]/)) {
    console.error('This function expects hexadeciamal number (consisting only of 0-9 and a-f)');
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
      console.error('This function expects hexadecimal representation of color in this format "#xxxxxx".');
    }

  const r = hexToDec(hex.slice(1, 3));
  const g = hexToDec(hex.slice(3, 5));
  const b = hexToDec(hex.slice(5, 7));

  return { r, g, b };
}

export function RGBObjectToString(obj) {
  if(typeof obj !== 'object') {
    console.error(`Expected object representing color in rgb format, received "${obj}" of type "${typeof obj}" instead.`);
  } else if(!Number.isInteger(obj.r) || obj.r < 0 || obj.r > 255) {
    console.error(`Expected "r" property of received object to be an integer between 0 and 255, received "${obj.r}" of type "${typeof obj.r}" instead.`);
  } else if(!Number.isInteger(obj.g) || obj.g < 0 || obj.g > 255) {
    console.error(`Expected "g" property of received object to be an integer between 0 and 255, received "${obj.g}" of type "${typeof obj.g}" instead.`);
  } else if(!Number.isInteger(obj.b) || obj.b < 0 || obj.b > 255) {
    console.error(`Expected "b" property of received object to be an integer between 0 and 255, received "${obj.b}" of type "${typeof obj.b}" instead.`);
  }

  return `rgb(${obj.r}, ${obj.g}, ${obj.b})`;
}

export function objectEquals(obj1, obj2) {
  /* not good for comparing objects containing complex data types, only primitives */
  
  for(let key in obj1) {
    if(obj1[key] !== obj2[key]) {
      return false;
    }
  }

  for(let key in obj2) {
    if(obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
}

export function doGetCanvasCopy(canvasElement) {
  const newCanvas = document.createElement('canvas');
  newCanvas.width = canvasElement.width;
  newCanvas.height = canvasElement.height;
  newCanvas.getContext('2d').drawImage(canvasElement, 0, 0);
  return newCanvas;
}