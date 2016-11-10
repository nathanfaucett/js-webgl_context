var Uniform = require("./Uniform");


module.exports = UniformTexture;


function UniformTexture(context, name, location, size) {
    Uniform.call(this, context, name, location, size);
}
Uniform.extend(UniformTexture);

UniformTexture.prototype.set = function(value, force) {
    this.context.setTexture(this.location, value, force);
    return this;
};