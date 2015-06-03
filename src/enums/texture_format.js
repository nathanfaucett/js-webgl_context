var enums = require("enums"),
    gl = require("./gl");


module.exports = enums({
    RGB: gl.RGB,
    RGBA: gl.RGBA,
    Alpha: gl.ALPHA,
    Luminance: gl.LUMINANCE,
    LuminanceAlpha: gl.LUMINANCE_ALPHA
});
