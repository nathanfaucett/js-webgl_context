var Uniform = require("./Uniform");


module.exports = UniformTextureCube;


function UniformTextureCube(context, name, location, size) {
    Uniform.call(this, context, name, location, size);
}
Uniform.extend(UniformTextureCube);

UniformTextureCube.prototype.set = function(value, force) {
    this.context.setTexture(this.location, value, force);
    return this;
};
