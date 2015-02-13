var Uniform = require("./uniform");


module.exports = Uniform1f;


function Uniform1f(context, name, location) {
    Uniform.call(this, context, name, location);
}
Uniform.extend(Uniform1f);

Uniform1f.prototype.set = function(value, force) {
    var context = this.context;

    if (force || context.__programForce || this.value !== value) {
        context.gl.uniform1f(this.location, value);
        this.value = value;
    }

    return this;
};
