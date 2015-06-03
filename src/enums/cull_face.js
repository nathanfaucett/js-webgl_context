var enums = require("enums"),
    gl = require("./gl");


module.exports = enums({
    None: 1,
    Back: gl.BACK,
    Front: gl.FRONT,
    FrontAndBack: gl.FRONT_AND_BACK
});
