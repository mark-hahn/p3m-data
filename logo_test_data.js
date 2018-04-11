var fs = require("fs");

var fileIn = fs.readFileSync("logotable.asm", 'utf8');
var lines = fileIn.split("\n");

curPage = 0;
curCol  = 0;
pixels  = [];

var byte = function(b) {
  for (var row = 0; row < 8; row++) {
    pixels[curPage*128*8 + row*128 + curCol] = (b >> 7);
    b <<= 1;
  }
  if(++curCol == 128) {
    curPage++;
    curCol = 0;
  }
}

curPixel   = 0;
curByte    = 0;
curByteLen = 0;

var word = function(run) {
  for(var i=0; i < run; i++) {
    curByte = (curByte << 1) + curPixel;
    if(++curByteLen == 8) {
      byte(curByte);
      curByte = 0;
      curByteLen = 0;
    }
  }
  if(run < 127) curPixel = 1-curPixel;
}

for (var i=0; i < lines.length; i++) {
  var line = lines[i];
  if(line.substring(0,6) == " DW 0x") {
    var words = parseInt(line.substring(6,10),16);
    word(words >> 7);
    word(words & 0x7f);
  }
}

for(var row = 0; row < 64; row++) {
  var s = (row % 8) + ' ';
  for(var col=0; col < 128; col++) {
    s += (pixels[row*128+col] ? '*' : ' ');
  }
  console.log(s);
}
