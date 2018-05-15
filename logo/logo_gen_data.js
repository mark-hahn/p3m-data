
var fs = require("fs");
var getPixels = require("get-pixels")

var asm = "PSECT logotblsect,class=CODE,local,delta=2\n";
   asm += "GLOBAL _logotable\n";
   asm += "_logotable:\n";

var curPixel = 0;
var run = 0;
var ofs7 = false;
var runCount = 0;
var word;
var pixlCnt = 0;

var addPixel = function(pixel) {
  if(pixel == curPixel) {
    run++;
    if(run < 127) return;
  }
  pixlCnt += run;
  console.log(++runCount, pixlCnt, run);
  if(!ofs7) {
    word = run;
  } else {
    word = ((word << 7) + run).toString(16);
    while(word.length < 4) word = "0" + word;
    asm += " DW 0x" + word + "\n";
  }
  ofs7 = !ofs7;
  curPixel = pixel;
  run = (run == 127 ? 0 : 1);
}

getPixels("logo.gif", function(err, pixels) {
  if(err) {
    console.log("getPixels error")
    return
  }
  console.log("got pixels", pixels.shape.slice());
  console.log(pixels.data.length);
  var bytes=[];
  for(var i = 3; i < pixels.data.length; i+=4) {
    bytes.push(pixels.data[i+3]);
  }
  for (var page=0; page<8; page++) {
    for(var col=0; col<128; col++) {
      for(var row=0; row<8; row++) {
        addPixel(bytes[ (page*128*8) + (row*128) + col ] ? 1 : 0);
      }
    }
  }
  if(ofs7) {
    word = (word << 7) + run;
    asm += " DW 0x" + word.toString(16) + "\n";
  }
  fs.writeFileSync('logotable.as', asm);
});
