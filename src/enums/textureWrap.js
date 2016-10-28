var enums = require("@nathanfaucett/enums"),
    gl = require("./gl");


module.exports = enums({
    REPEAT: gl.REPEAT,
    CLAMP: gl.CLAMP_TO_EDGE,
    MIRRORED_REPEAT: gl.MIRRORED_REPEAT
});
