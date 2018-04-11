fs = require("fs");

hex = fs.readFileSync("hex.txt", 'utf8');
hex = hex.replace(/\s/g,'');
s = "";
idx = 0;
line = 11;
row = "";
function showChr(c) {
  if((idx > 3) && (idx < 8 || idx > 11)) row += c;
  if(++idx == 16) {
    row += '\n';
    idx = 0;
    line++;
    if(line < 14) s += row;
    row = '';
    if(line == 28) {
      line = 0;
      s+='---------------\n';
    }
  }
}

for(i=0; i<hex.length; i++) {
  h = parseInt(hex[i], 16);
  for (k=0; k<8; k++) {
    showChr((h & 0x80) ? '*' : ' ');
    h <<= 1;
  }
}
console.log(s);

/*
     *****
    **  ***
    ** ****
    **** **
    ***  **
    **   **
     *****

*/
