var Uniform = require("./uniform");


module.exports = UniformTextureCube;


function UniformTextureCube(context, name, location) {
    Uniform.call(this, context, name, location);
}
Uniform.extend(UniformTextureCube);

UniformTextureCube.prototype.set = function(value, force) {
    this.context.setTexture(this.location, value, force);
    return this;
};
