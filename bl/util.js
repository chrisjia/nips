
var SEED = "0123456789";

var util = exports.util = {
  random: function(n) {
      var result = "";
      while(n-- > 0) {
          result += SEED.substr(Math.floor(Math.randome() * 10),1);
      }
  }
}