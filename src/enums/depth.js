var gl = require("./gl");


module.exports = {
    None: 1,
    Never: gl.NEVER,
    Less: gl.LESS,
    Equal: gl.EQUAL,
    LessThenOrEqual: gl.LEQUAL,
    Greater: gl.GREATER,
    NotEqual: gl.NOTEQUAL,
    GreaterThanOrEqual: gl.GEQUAL,
    Always: gl.ALWAYS
};
