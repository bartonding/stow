const fs = require('fs');
const path = require('path');
const wc = require('./webpack.config.js');

const filename = path.resolve(wc.output.path, wc.output.filename);

let content = fs.readFileSync(filename, {encoding: 'utf-8'}).toString();

// 除 ASCII 码外，都转为 Unicode
// \u 之后跟 4 位十六进制数。取值范围：\u0000 到 \uffff
// \x 之后跟 2 位十六进制数。取值范围：\x00 到 \xff
content = content.replace(/[\u0080-\uffff]/g, function (ch) {
  var code = ch.charCodeAt(0).toString(16);
  // console.log(ch, code);
  if (code.length <= 2) {
      while (code.length < 2) code = "0" + code;
      return "\\x" + code;
  } else {
      while (code.length < 4) code = "0" + code;
      return "\\u" + code;
  }
});

fs.writeFileSync(filename, content);
