
// use one of these
// node font-test.js 'font708.asm'  7 8
// node font-test.js 'font813.asm'  8 13

file = process.argv[2];
wid = parseInt(process.argv[3]);
hgt = parseInt(process.argv[4]);
console.log(file, wid, hgt);

var fs = require("fs");

var fileIn = fs.readFileSync(file, 'utf8');
var lines = fileIn.split("\n");
lines = lines.splice(3);

for(i=0; i<lines.length; i++) {
  if((i % wid) == 0) console.log('-------');
  line = lines[i];
  word = parseInt(line.slice(6), 16);

  switch(wid*100+hgt) {
    case 708:


      break;

    case 813:
      s="";
      for(j=0; j<hgt; j++) {
        s += (word & 1) ? '*' : ' ';
        word >>= 1;
      }
      console.log(s);
      break;

    default:
      console.log('invalid size');
  }
}

//
// for(var row = 0; row < 64; row++) {
//   var s = (row % 8) + ' ';
//   for(var col=0; col < 128; col++) {
//     s += (pixels[row*128+col] ? '*' : ' ');
//   }
//   console.log(s);
// }
