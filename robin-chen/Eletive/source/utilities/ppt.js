import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
import client from 'api/client';

class PPT {
  zip = null;

  imageScale = 5;

  get exportDate() {
    return moment().format('YYYY-MM-DD');
  }

  load = async (path) => {
    const blob = await client.getStatic(path, true);
    this.zip = await JSZip.loadAsync(blob);
  }

  escapeXMLChars = (text) => {
    let newText = text.replace(/(<([^>]+)>)/ig, '');
    newText = newText.replace(/&/g, '&amp;');
    newText = newText.replace(/</g, '&lt;');
    newText = newText.replace(/>/g, '&gt;');
    newText = newText.replace(/"/g, '&quot;');
    newText = newText.replace(/'/g, '&apos;');
    return newText;
  }

  replaceText = async (slidePath, replacements) => {
    if (!this.zip) {
      return;
    }

    if (!Array.isArray(replacements)) {
      return;
    }

    const slideContent = await this.zip.file(slidePath).async('string');
    const updatedContent = replacements.reduce((prev, replacement) => {
      const { templateText, replaceText } = replacement;
      let textToReplace = replaceText;
      if (typeof replaceText === 'string') {
        textToReplace = this.escapeXMLChars(replaceText);
      }
      return prev.replace(templateText, textToReplace);
    }, slideContent);

    await this.zip.file(slidePath, updatedContent);
  }

  replaceImageWithSVG = async (imagePath, svg, width, height) => {
    if (imagePath === 'ppt/media/undefined') {
      return;
    }
    // eslint-disable-next-line no-use-before-define
    const blob = await svgToBlob(svg, width * this.imageScale, height * this.imageScale);
    await this.replaceImageBlob(imagePath, blob);
  }

  replaceImageBlob = async (imagePath, imageBlob) => {
    if (imagePath === 'ppt/media/undefined') {
      return;
    }
    await this.zip.file(imagePath, imageBlob);
  }

  download = async (fileName) => {
    if (!this.zip) {
      return;
    }

    const blob = await this.zip.generateAsync({ type: 'blob' });
    saveAs(blob, fileName);
  }
}

const svgToBlob = (svg, width, height) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.setAttribute('width', width);
  canvas.setAttribute('height', height);
  const img = new Image();
  const utf8Svg = unescape(encodeURIComponent(svg));
  const url = `data:image/svg+xml;base64,${btoa(utf8Svg)}`;

  return new Promise((resolve) => {
    img.onload = () => {
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
      const dataURL = canvas.toDataURL('image/png');
      const data = atob(dataURL.substring('data:image/png;base64,'.length));
      // eslint-disable-next-line compat/compat
      const asArray = new Uint8Array(data.length);

      for (let i = 0, len = data.length; i < len; i += 1) {
        asArray[i] = data.charCodeAt(i);
      }

      const blob = new Blob([asArray.buffer], { type: 'image/png' });
      canvas.remove();
      resolve(blob);
    };
    img.src = url;
  });
};

// NOTE: it will not work in IE
const driverIconToBlob = (svg, color) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.setAttribute('width', 360);
  canvas.setAttribute('height', 360);
  context.fillStyle = color;
  context.beginPath();
  context.arc(180, 180, 180, 0, 2 * Math.PI);
  context.fill();
  const img = new Image();
  const url = `data:image/svg+xml;base64,${btoa(svg)}`;
  return new Promise(((resolve) => {
    img.onload = () => {
      context.drawImage(img, 80, 80, 200, 200);
      const dataURL = canvas.toDataURL('image/png');
      const data = atob(dataURL.substring('data:image/png;base64,'.length));
      // eslint-disable-next-line compat/compat
      const asArray = new Uint8Array(data.length);

      for (let i = 0, len = data.length; i < len; i += 1) {
        asArray[i] = data.charCodeAt(i);
      }

      const blob = new Blob([asArray.buffer], { type: 'image/png' });
      canvas.remove();
      resolve(blob);
    };
    img.src = url;
  }));
};

// NOTE: it will not work in IE
const customDriverIconToBlob = (text, color) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.setAttribute('width', 360);
  canvas.setAttribute('height', 360);
  context.fillStyle = color;
  context.beginPath();
  context.arc(180, 180, 180, 0, 2 * Math.PI);
  context.fill();
  context.font = '150px Arial';
  context.fillStyle = '#ffffff';
  context.textAlign = 'center';
  context.fillText(text, 180, 230);
  return new Promise(((resolve) => {
    const dataURL = canvas.toDataURL('image/png');
    const data = atob(dataURL.substring('data:image/png;base64,'.length));
    // eslint-disable-next-line compat/compat
    const asArray = new Uint8Array(data.length);

    for (let i = 0, len = data.length; i < len; i += 1) {
      asArray[i] = data.charCodeAt(i);
    }

    const blob = new Blob([asArray.buffer], { type: 'image/png' });
    canvas.remove();
    resolve(blob);
  }));
};

export {
  PPT,
  driverIconToBlob,
  customDriverIconToBlob,
};
