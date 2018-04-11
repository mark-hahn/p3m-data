fs = require("fs");

hex = fs.readFileSync('homespun_font(7x8).h', 'utf8');
lines = hex.split('\n');
s = '';
for(i=1; i<lines.length; i++) {
  line = lines[i];
  asts = [];
  for(j=0; j<8; j++) asts[j] = '';
  for(j=4; j<36; j+=5) {
    byte = parseInt(line[j] + line[j+1], 16);
    for (k=0; k<8; k++) {
      asts[k] += ((byte & 1) ? '*' : ' ');
      byte >>= 1;
    }
  }
  for (j=0; j<8; j++) {
    s+=asts[j]+'\n';
  }
  s+='---------\n';
}
console.log(s);

//
//
// s = "";
// idx = 0;
// line = 11;
// row = "";
// function showChr(c) {
//   if((idx > 3) && (idx < 8 || idx > 11)) row += c;
//   if(++idx == 16) {
//     row += '\n';
//     idx = 0;
//     line++;
//     if(line < 14) s += row;
//     row = '';
//     if(line == 28) {
//       line = 0;
//       s+='---------------\n';
//     }
//   }
// }
//
// for(i=0; i<hex.length; i++) {
//   h = parseInt(hex[i], 16);
//   for (k=0; k<8; k++) {
//     showChr((h & 0x80) ? '*' : ' ');
//     h <<= 1;
//   }
// }
// console.log(s);
//
// /*
//      *****
//     **  ***
//     ** ****
//     **** **
//     ***  **
//     **   **
//      *****
//
// */
