var enums = require("@nathanfaucett/enums"),
    gl = require("./gl");


module.exports = enums({
    RGB: gl.RGB,
    RGBA: gl.RGBA,
    ALPHA: gl.ALPHA,
    LUMINANCE: gl.LUMINANCE,
    LUMINANCE_ALPHA: gl.LUMINANCE_ALPHA
});
