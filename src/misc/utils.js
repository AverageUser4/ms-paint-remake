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
     
  s /= 100;
  l /= 100;
  
  const C = (1 - Math.abs(2 * l - 1)) * s;
  const X = C * (1 - Math.abs(h / 60) % 2 - 1);
  const m = l - C / 2;

  let $r, $g, $b;

  if(h < 60) {
    $r = C; $g = X; $b = 0;
  } else if(h < 120) {
    $r = X; $g = C; $b = 0;
  } else if(h < 180) {
    $r = 0; $g = C; $b = X;
  } else if(h < 240) {
    $r = 0; $g = X; $b = C;
  } else if(h < 300) {
    $r = X; $g = 0; $b = C;
  } else {
    $r = C; $g = 0; $b = X;
  }

  const r = Math.round(Math.abs(($r + m) * 255));
  const g = Math.round(Math.abs(($g + m) * 255));
  const b = Math.round(Math.abs(($b + m) * 255));

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