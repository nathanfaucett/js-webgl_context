var enums = require("enums"),
    gl = require("./gl");


module.exports = enums({
    Repeat: gl.REPEAT,
    Clamp: gl.CLAMP_TO_EDGE,
    MirrorRepeat: gl.MIRRORED_REPEAT
});
