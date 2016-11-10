var enums = require("@nathanfaucett/enums"),
    gl = require("./gl");


module.exports = enums({
    NONE: 1,
    BACK: gl.BACK,
    FRONT: gl.FRONT,
    FRONT_AND_BACK: gl.FRONT_AND_BACK
});