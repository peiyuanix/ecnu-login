const sha1 = require("js-sha1");
const md5 = require('md5');
const https = require('https');
const querystring = require('querystring');

function sendGetRequest(url, params) {
  const queryParams = querystring.stringify(params);
  const requestUrl = url + '?' + queryParams;

  return new Promise((resolve, reject) => {
    https.get(requestUrl, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve(data);
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

function srbx1(info, token) {
  base64.setAlpha('LVoJPiCN2R8G90yg+hmFHuacZ1OWMnrsSTXkYpUq/3dlbfKwv6xztjI7DeBE45QA'); // 用户信息转 JSON

  info = JSON.stringify(info);

  function encode(str, key) {
    if (str === '') return '';
    var v = s(str, true);
    var k = s(key, false);
    if (k.length < 4) k.length = 4;
    var n = v.length - 1,
      z = v[n],
      y = v[0],
      c = 0x86014019 | 0x183639A0,
      m,
      e,
      p,
      q = Math.floor(6 + 52 / (n + 1)),
      d = 0;

    while (0 < q--) {
      d = d + c & (0x8CE0D9BF | 0x731F2640);
      e = d >>> 2 & 3;

      for (p = 0; p < n; p++) {
        y = v[p + 1];
        m = z >>> 5 ^ y << 2;
        m += y >>> 3 ^ z << 4 ^ (d ^ y);
        m += k[p & 3 ^ e] ^ z;
        z = v[p] = v[p] + m & (0xEFB8D130 | 0x10472ECF);
      }

      y = v[0];
      m = z >>> 5 ^ y << 2;
      m += y >>> 3 ^ z << 4 ^ (d ^ y);
      m += k[p & 3 ^ e] ^ z;
      z = v[n] = v[n] + m & (0xBB390742 | 0x44C6F8BD);
    }

    return l(v, false);
  }

  function s(a, b) {
    var c = a.length;
    var v = [];

    for (var i = 0; i < c; i += 4) {
      v[i >> 2] = a.charCodeAt(i) | a.charCodeAt(i + 1) << 8 | a.charCodeAt(i + 2) << 16 | a.charCodeAt(i + 3) << 24;
    }

    if (b) v[v.length] = c;
    return v;
  }

  function l(a, b) {
    var d = a.length;
    var c = d - 1 << 2;

    if (b) {
      var m = a[d - 1];
      if (m < c - 3 || m > c) return null;
      c = m;
    }

    for (var i = 0; i < d; i++) {
      a[i] = String.fromCharCode(a[i] & 0xff, a[i] >>> 8 & 0xff, a[i] >>> 16 & 0xff, a[i] >>> 24 & 0xff);
    }

    return b ? a.join('').substring(0, c) : a.join('');
  }

  return '{SRBX1}' + base64.encode(encode(info, token));
}

class Base64 {
  constructor() {
    this._PADCHAR = "=";
    this._ALPHA = "LVoJPiCN2R8G90yg+hmFHuacZ1OWMnrsSTXkYpUq/3dlbfKwv6xztjI7DeBE45QA";
    this._VERSION = "1.0";
  }

  _getbyte64(s, i) {
    const idx = this._ALPHA.indexOf(s.charAt(i));
    if (idx === -1) {
      throw "Cannot decode base64";
    }
    return idx;
  }

  decode(s) {
    let pads = 0;
    let i, b10;
    const imax = s.length;
    const x = [];

    s = String(s);

    if (imax === 0) {
      return s;
    }

    if (imax % 4 !== 0) {
      throw "Cannot decode base64";
    }

    if (s.charAt(imax - 1) === this._PADCHAR) {
      pads = 1;
      if (s.charAt(imax - 2) === this._PADCHAR) {
        pads = 2;
      }
      imax -= 4;
    }

    for (i = 0; i < imax; i += 4) {
      b10 = (this._getbyte64(s, i) << 18) |
        (this._getbyte64(s, i + 1) << 12) |
        (this._getbyte64(s, i + 2) << 6) |
        this._getbyte64(s, i + 3);

      x.push(
        String.fromCharCode(b10 >> 16, (b10 >> 8) & 255, b10 & 255)
      );
    }

    switch (pads) {
      case 1:
        b10 = (this._getbyte64(s, i) << 18) |
          (this._getbyte64(s, i + 1) << 12) |
          (this._getbyte64(s, i + 2) << 6);
        x.push(
          String.fromCharCode(b10 >> 16, (b10 >> 8) & 255)
        );
        break;
      case 2:
        b10 = (this._getbyte64(s, i) << 18) |
          (this._getbyte64(s, i + 1) << 12);
        x.push(
          String.fromCharCode(b10 >> 16)
        );
        break;
    }

    return x.join("");
  }

  _getbyte(s, i) {
    const x = s.charCodeAt(i);
    if (x > 255) {
      throw "INVALID_CHARACTER_ERR: DOM Exception 5";
    }
    return x;
  }

  encode(s) {
    if (arguments.length !== 1) {
      throw "SyntaxError: exactly one argument required";
    }
    s = String(s);

    let i, b10;
    const x = [];
    const imax = s.length - s.length % 3;

    if (s.length === 0) {
      return s;
    }

    for (i = 0; i < imax; i += 3) {
      b10 = (this._getbyte(s, i) << 16) |
        (this._getbyte(s, i + 1) << 8) |
        this._getbyte(s, i + 2);

      x.push(this._ALPHA.charAt(b10 >> 18));
      x.push(this._ALPHA.charAt((b10 >> 12) & 63));
      x.push(this._ALPHA.charAt((b10 >> 6) & 63));
      x.push(this._ALPHA.charAt(b10 & 63));
    }

    switch (s.length - imax) {
      case 1:
        b10 = this._getbyte(s, i) << 16;
        x.push(
          this._ALPHA.charAt(b10 >> 18) +
          this._ALPHA.charAt((b10 >> 12) & 63) +
          this._PADCHAR +
          this._PADCHAR
        );
        break;
      case 2:
        b10 = (this._getbyte(s, i) << 16) |
          (this._getbyte(s, i + 1) << 8);
        x.push(
          this._ALPHA.charAt(b10 >> 18) +
          this._ALPHA.charAt((b10 >> 12) & 63) +
          this._ALPHA.charAt((b10 >> 6) & 63) +
          this._PADCHAR
        );
        break;
    }

    return x.join("");
  }

  setAlpha(s) {
    this._ALPHA = s;
  }
}

const base64 = new Base64();

// 登录并获取数据
async function loginAndGetResponse() {
  if (process.argv.length != 4) {
    console.error("Usage: program {username} {password}");
    return;
  }
  const username = process.argv[2];
  const password = process.argv[3];

  try {
    const url1 = 'https://login.ecnu.edu.cn/cgi-bin/get_challenge';
    const params1 = {
      callback: 'somecallbackname',
      username: username,
    };

    const response1 = await sendGetRequest(url1, params1);
    console.log(response1);

    // 截取 JSON 字符串
    const jsonStartIndex = response1.indexOf('{');
    const jsonEndIndex = response1.lastIndexOf('}');
    const jsonResponse = response1.substring(jsonStartIndex, jsonEndIndex + 1);
    // 解析为 JSON 对象
    const respobj = JSON.parse(jsonResponse);
    const ip = respobj.client_ip;
    const token = respobj.challenge;

    const info = {
      "username": username,
      "password": password,
      "ip": ip,
      "acid": "1",
      "enc_ver": "srun_bx1"
    };
    const ac_id = 1;
    const type = 1;
    const n = 200;
    const vari = srbx1(info, token);

    const url2 = 'https://login.ecnu.edu.cn/cgi-bin/srun_portal';
    const hmd5 = md5(password, token);
    var str = token + username;
    str += token + hmd5;
    str += token + 1; //1
    str += token + ip;
    str += token + 200; // 200
    str += token + 1; // 1
    str += token + vari; // 防止 IPv6 请求网络不通进行 try catch
    const params2 = {
      callback: 'somecallbackname',
      action: 'login',
      username: username,
      password: '{MD5}' + hmd5,
      double_stack: 0,
      chksum: sha1(str),
      info: vari,
      ac_id: ac_id,
      ip: ip,
      n: n,
      type: type
    };

    const response2 = await sendGetRequest(url2, params2);
    console.log(response2);
  } catch (error) {
    console.error(error);
  }
}

// 执行登录并获取数据
loginAndGetResponse();
