/**
 * @description: base64 to blob
 */
export function dataURLtoBlob(base64Buf: string): Blob {
  const arr = base64Buf.split(',');
  const typeItem = arr[0];
  const mime = typeItem.match(/:(.*?);/)![1];
  const bstr = window.atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * img url to base64
 * @param url
 */
export function urlToBase64(url: string, mineType?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let canvas = document.createElement('CANVAS') as Nullable<HTMLCanvasElement>;
    const ctx = canvas!.getContext('2d');

    const img = new Image();
    img.crossOrigin = '';
    img.onload = function () {
      if (!canvas || !ctx) {
        return reject();
      }
      canvas.height = img.height;
      canvas.width = img.width;
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL(mineType || 'image/png');
      canvas = null;
      resolve(dataURL);
    };
    img.src = url;
  });
}

export const Base64 = {
  // 转码表
  tables: [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '+',
    '/',
  ],
  UTF16ToUTF8: function (str) {
    const results = [],
      len = str.length;
    for (let i = 0; i < len; i++) {
      const code = str.charCodeAt(i);
      if (code > 0x0000 && code <= 0x007f) {
        /* 一字节，不考虑0x0000，因为是空字节
				   U+00000000 – U+0000007F 	0xxxxxxx
				*/
        results.push(str.charAt(i));
      } else if (code >= 0x0080 && code <= 0x07ff) {
        /* 二字节
				   U+00000080 – U+000007FF 	110xxxxx 10xxxxxx
				   110xxxxx
				*/
        const byte1 = 0xc0 | ((code >> 6) & 0x1f);
        // 10xxxxxx
        const byte2 = 0x80 | (code & 0x3f);
        results.push(String.fromCharCode(byte1), String.fromCharCode(byte2));
      } else if (code >= 0x0800 && code <= 0xffff) {
        /* 三字节
				   U+00000800 – U+0000FFFF 	1110xxxx 10xxxxxx 10xxxxxx
				   1110xxxx
				*/
        const byte1 = 0xe0 | ((code >> 12) & 0x0f);
        // 10xxxxxx
        const byte2 = 0x80 | ((code >> 6) & 0x3f);
        // 10xxxxxx
        const byte3 = 0x80 | (code & 0x3f);
        results.push(
          String.fromCharCode(byte1),
          String.fromCharCode(byte2),
          String.fromCharCode(byte3),
        );
      } else if (code >= 0x00010000 && code <= 0x001fffff) {
        // 四字节
        // U+00010000 – U+001FFFFF 	11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
      } else if (code >= 0x00200000 && code <= 0x03ffffff) {
        // 五字节
        // U+00200000 – U+03FFFFFF 	111110xx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
      } /** if (code >= 0x04000000 && code <= 0x7FFFFFFF)*/ else {
        // 六字节
        // U+04000000 – U+7FFFFFFF 	1111110x 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
      }
    }

    return results.join('');
  },
  UTF8ToUTF16: function (str) {
    const results = [],
      len = str.length;
    const i = 0;
    for (let i = 0; i < len; i++) {
      const code = str.charCodeAt(i);
      // 第一字节判断
      if (((code >> 7) & 0xff) == 0x0) {
        // 一字节
        // 0xxxxxxx
        results.push(str.charAt(i));
      } else if (((code >> 5) & 0xff) == 0x6) {
        // 二字节
        // 110xxxxx 10xxxxxx
        const code2 = str.charCodeAt(++i);
        const byte1 = (code & 0x1f) << 6;
        const byte2 = code2 & 0x3f;
        const utf16 = byte1 | byte2;
        results.push(Sting.fromCharCode(utf16));
      } else if (((code >> 4) & 0xff) == 0xe) {
        // 三字节
        // 1110xxxx 10xxxxxx 10xxxxxx
        const code2 = str.charCodeAt(++i);
        const code3 = str.charCodeAt(++i);
        const byte1 = (code << 4) | ((code2 >> 2) & 0x0f);
        const byte2 = ((code2 & 0x03) << 6) | (code3 & 0x3f);
        const utf16 = ((byte1 & 0x00ff) << 8) | byte2;
        results.push(String.fromCharCode(utf16));
      } else if (((code >> 3) & 0xff) == 0x1e) {
        // 四字节
        // 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
      } else if (((code >> 2) & 0xff) == 0x3e) {
        // 五字节
        // 111110xx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
      } /** if (((code >> 1) & 0xFF) == 0x7E)*/ else {
        // 六字节
        // 1111110x 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
      }
    }

    return results.join('');
  },
  encode: function (str) {
    if (!str) {
      return '';
    }
    const utf8 = this.UTF16ToUTF8(str); // 转成UTF-8
    let i = 0; // 遍历索引
    const len = utf8.length;
    const results = [];
    while (i < len) {
      const c1 = utf8.charCodeAt(i++) & 0xff;
      results.push(this.tables[c1 >> 2]);
      // 补2个=
      if (i == len) {
        results.push(this.tables[(c1 & 0x3) << 4]);
        results.push('==');
        break;
      }
      const c2 = utf8.charCodeAt(i++);
      // 补1个=
      if (i == len) {
        results.push(this.tables[((c1 & 0x3) << 4) | ((c2 >> 4) & 0x0f)]);
        results.push(this.tables[(c2 & 0x0f) << 2]);
        results.push('=');
        break;
      }
      const c3 = utf8.charCodeAt(i++);
      results.push(this.tables[((c1 & 0x3) << 4) | ((c2 >> 4) & 0x0f)]);
      results.push(this.tables[((c2 & 0x0f) << 2) | ((c3 & 0xc0) >> 6)]);
      results.push(this.tables[c3 & 0x3f]);
    }

    return results.join('');
  },
  decode: function (str) {
    //判断是否为空
    if (!str) {
      return '';
    }

    const len = str.length;
    let i = 0;
    const results = [];
    //循环解出字符数组
    while (i < len) {
      const code1 = this.tables.indexOf(str.charAt(i++));
      const code2 = this.tables.indexOf(str.charAt(i++));
      const code3 = this.tables.indexOf(str.charAt(i++));
      const code4 = this.tables.indexOf(str.charAt(i++));

      const c1 = (code1 << 2) | (code2 >> 4);
      results.push(String.fromCharCode(c1));

      if (code3 != -1) {
        const c2 = ((code2 & 0xf) << 4) | (code3 >> 2);
        results.push(String.fromCharCode(c2));
      }
      if (code4 != -1) {
        const c3 = ((code3 & 0x3) << 6) | code4;
        results.push(String.fromCharCode(c3));
      }
    }

    return this.UTF8ToUTF16(results.join(''));
  },
};
