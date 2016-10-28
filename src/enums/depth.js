var enums = require("@nathanfaucett/enums"),
    gl = require("./gl");


module.exports = enums({
    NONE: 1,
    NEVER: gl.NEVER,
    LESS: gl.LESS,
    EQUAL: gl.EQUAL,
    LEQUAL: gl.LEQUAL,
    GREATER: gl.GREATER,
    NOTEQUAL: gl.NOTEQUAL,
    GEQUAL: gl.GEQUAL,
    ALWAYS: gl.ALWAYS
});
