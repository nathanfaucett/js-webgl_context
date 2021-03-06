var objectReverse = require("@nathanfaucett/object-reverse");


var enums = exports;


enums.blending = require("./blending");
enums.cullFace = require("./cullFace");
enums.depth = require("./depth");
enums.filterMode = require("./filterMode");

enums.gl = require("./gl");
enums.glValues = objectReverse(enums.gl);

enums.textureFormat = require("./textureFormat");
enums.textureType = require("./textureType");
enums.textureWrap = require("./textureWrap");