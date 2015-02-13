var Uniform = require("./uniform");


module.exports = Uniform1b;


function Uniform1b(context, name, location) {
    Uniform.call(this, context, name, location);
}
Uniform.extend(Uniform1b);

Uniform1b.prototype.set = function(value, force) {
    var context = this.context;

    if (force || context.__programForce || this.value !== value) {
        context.gl.uniform1i(this.location, value);
        this.value = value;
    }

    return this;
};
