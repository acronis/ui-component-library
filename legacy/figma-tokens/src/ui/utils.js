function downloadFile(content, filename) {
  const blob = new Blob([content], { type: 'application/json' });
  const blobURL = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobURL;
  link.download = filename || 'export.plugin.json';
  link.click();
}

function nodeToObject(node, withoutRelations) {
  // eslint-disable-next-line no-proto
  const props = Object.entries(Object.getOwnPropertyDescriptors(node.__proto__));
  const blacklist = ['parent', 'children', 'removed', 'masterComponent'];
  const obj = { id: node.id, type: node.type };
  for (const [name, prop] of props) {
    if (prop.get && !blacklist.includes(name)) {
      try {
        if (typeof obj[name] === 'symbol') {
          obj[name] = 'Mixed';
        }
        else {
          obj[name] = prop.get.call(node);
        }
      }
      catch {
        obj[name] = undefined;
      }
    }
  }
  if (node.parent && !withoutRelations) {
    obj.parent = { id: node.parent.id, type: node.parent.type };
  }
  if (node.children && !withoutRelations) {
    obj.children = node.children.map(child => nodeToObject(child, withoutRelations));
  }
  if (node.masterComponent && !withoutRelations) {
    obj.masterComponent = nodeToObject(node.masterComponent, withoutRelations);
  }
  return obj;
}

// function ColorToHex(rgb) {
//   let hex = Number(rgb).toString(16);
//   if (hex.length < 2) {
//     hex = `0${hex}`;
//   }
//
//   return hex.toUpperCase();
// }

// function RGBToHex(r, g, b) {
//   const red = ColorToHex(r);
//   const green = ColorToHex(g);
//   const blue = ColorToHex(b);
//
//   return `#${red}${green}${blue}`;
// }

function RGBToHSL(red, green, blue, alpha) {
  // Make red, green, and blue fractions of 1
  if (red > 1) {
    red /= 255;
  }
  if (green > 1) {
    green /= 255;
  }
  if (blue > 1) {
    blue /= 255;
  }

  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;

  let hue;
  let saturation;
  let lightness = (max + min) / 2;

  if (max === min) {
    hue = saturation = 0; // achromatic
  }
  else {
    saturation = delta === 0 ? 0 : delta / (1 - Math.abs((2 * lightness) - 1));

    switch (max) {
      case red: hue = ((green - blue) / delta) % 6;
        break;
      case green: hue = ((blue - red) / delta) + 2;
        break;
      case blue: hue = ((red - green) / delta) + 4;
        break;
    }

    hue = Math.round(hue * 60);

    // Make negative hues positive behind 360°
    if (hue < 0) {
      hue += 360;
    }
  }

  saturation = +(saturation * 100).toFixed();
  lightness = +(lightness * 100).toFixed();
  alpha = Math.round((alpha + Number.EPSILON) * 100) / 100;

  if (alpha === 1) {
    return `hsl(${hue}deg ${saturation}% ${lightness}%)`;
  }

  return `hsla(${hue}deg ${saturation}% ${lightness}% / ${Math.round((alpha + Number.EPSILON) * 100) / 100})`;
}

export { downloadFile, nodeToObject, RGBToHSL };
