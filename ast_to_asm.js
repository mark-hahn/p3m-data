
// use one of these
// node ast_to_asm.js 'homespun(7x8)-ast.txt'  7 8
// node ast_to_asm.js 'ibm_mda(8x13)-ast.txt'  8 13

file = process.argv[2];
wid = parseInt(process.argv[3]);
hgt = parseInt(process.argv[4]);
console.log(file, wid, hgt);

fs = require('fs');

astFile = fs.readFileSync(file, 'utf8');
astLines = astFile.split('\n');
cols = [];
for(lineIdx = 0; lineIdx < astLines.length; lineIdx += (hgt+1)) {
  col = [];
  for(i=1; i<wid; i++) col[i] = 0;

  for(i=0; i<hgt; i++) {
    line = astLines[lineIdx+i];

    if(lineIdx == 56) console.log(line);

    for(j=0; j<wid; j++) {
      col[j] <<= 1;
      if(line[j] == '*') col[j] |= 1;
    }
  }
  empty = (lineIdx > 0);
  for(j=0; j<wid; j++) {
    cols.push(col[j]);
    if(col[j]) empty = false;
  }
  if(empty) break;
}

words = [];
switch(wid*100+hgt) {
  case 708:
    asmName = 'font708';
    for(col=0; col<cols.length; col+=7) {
      words.push((
        (cols[col+0] <<  6) |  // 8 bits
        (cols[col+1] >>  2)    // 6 bits
      ) & 0x3fff);
      words.push((
        (cols[col+1] << 12) |  // 2 bits
        (cols[col+2] <<  4) |  // 8 bits
        (cols[col+3] >>  4)    // 4 bits
      ) & 0x3fff);
      words.push((
        (cols[col+3] << 10) |   // 4 bits
        (cols[col+4] <<  2) |   // 8 bits
        (cols[col+5] >>  4)     // 2 bits
      ) & 0x3fff);
      words.push((
        (cols[col+5] <<  8) |   // 6 bits
        (cols[col+6] >>  0)     // 8 bits
      ) & 0x3fff);
    }
    words.pop();
    words.pop();
    words.pop();
    words.pop();
    break;

  case 813:
    asmName = 'font813';
    for(col=0; col<cols.length-8; col++) {
      words.push(cols[col]);
    }
    break;

  default:
    console.log('invalid size');
}

asm =  "PSECT " + asmName + "sect,class=CODE,local,delta=2\n";
asm += "GLOBAL _" + asmName + "\n";
asm += "_" + asmName + ":\n";

for(i=0; i<words.length; i++) {
  word = words[i].toString(16);
  while(word.length < 4) word = "0" + word;
  asm += " DW 0x" + word + "\n";
}
fs.writeFileSync(asmName + '.asm', asm);
