var enums = require("@nathanfaucett/enums"),
    gl = require("./gl");


module.exports = enums({
    UNSIGNED_BYTE: gl.UNSIGNED_BYTE,
    FLOAT: gl.FLOAT,
    DEPTH_COMPONENT: gl.DEPTH_COMPONENT,
    UNSIGNED_SHORT: gl.UNSIGNED_SHORT,
    UNSIGNED_SHORT_5_6_5: gl.UNSIGNED_SHORT_5_6_5,
    UNSIGNED_SHORT_4_4_4_4: gl.UNSIGNED_SHORT_4_4_4_4,
    UNSIGNED_SHORT_5_5_5_1: gl.UNSIGNED_SHORT_5_5_5_1
});
