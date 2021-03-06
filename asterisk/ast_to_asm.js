
// use one of these

// cd ~/dev/p3/pic/p3m_data/asterisk
// node ast_to_asm.js 'homespun(7x8)-ast.txt'  7 8
// cp font0708.asm ~/dev/p3/pic/p3mMcu

// cd ~/dev/p3/pic/p3m_data/asterisk
// node ast_to_asm.js 'ibm_mda(8x13)-ast.txt'  8 13
// cp font0813.asm ~/dev/p3/pic/p3mMcu

file = process.argv[2];
wid = parseInt(process.argv[3]);
hgt = parseInt(process.argv[4]);
console.log(file, wid, hgt);

fs = require('fs');

astFile = fs.readFileSync(file, 'utf8');
astLines = astFile.split('\n');
cols = [];
for(lineIdx = 0; lineIdx < astLines.length-3; lineIdx += (hgt+1)) {
  col = [];
  for(i=1; i<wid; i++) col[i] = 0;
  for(i=0; i<hgt; i++) {
    line = astLines[lineIdx+i];
    for(j=0; j<wid; j++) {
      col[j] <<= 1;
      if(line[j] == '*') col[j] |= 1;
    }
  }
  for(j=0; j<wid; j++) cols.push(col[j]);
}
var x = 0;
function reverseCol(idx) {
  var col = cols[idx];
  var newCol = 0
  for(var i=0; i<8; i++) {
    newCol <<= 1;
    newCol |= (col & 1);
    col >>= 1;
  }
  return newCol;
}

words = [];
switch(wid*100+hgt) {
  case 708:
    asmName = 'font0708';
    for(var col=0; col<cols.length; col+=7) {
      words.push((
        (reverseCol(col+0) <<  6) |  // 8 bits  0
        (reverseCol(col+1) >>  2)    // 6 bits  0
      ) & 0x3fff);
      words.push((
        (reverseCol(col+1) << 12) |  // 2 bits  0
        (reverseCol(col+2) <<  4) |  // 8 bits  0
        (reverseCol(col+3) >>  4)    // 4 bits  7e
      ) & 0x3fff);                   // 7
      words.push((
        (reverseCol(col+3) << 10) |   // 4 bits  7e (11 10 00 00 00 00 00)
        (reverseCol(col+4) <<  2) |   // 8 bits  42 (00 00 01 00 00 10 00)
        (reverseCol(col+5) >>  6)     // 2 bits  42 (00 00 00 00 00 00 01)
      ) & 0x3fff);                    // 3800 |  108 | 4 => 390c
      words.push(( // 0000 0000 0000 00, 00 0000 0000 0111
                   // 11 10 01 00 00 10 01, 00 0010 0100 0010
        (reverseCol(col+5) <<  8) |   // 6 bits  42
        (reverseCol(col+6) >>  0)     // 8 bits  42
      ) & 0x3fff);
    }
    words.pop();
    words.pop();
    words.pop();
    words.pop();
    break;

  case 813:
    asmName = 'font0813';
    for(col=0; col<cols.length-8; col++) {
      wordIn = cols[col];
      word = 0;
      for(j = 0; j < 14; j++) {
        word <<= 1;
        word |= (wordIn & 1);
        wordIn >>= 1;
      }
      words.push(word);
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
