var Uniform = require("./uniform");


module.exports = Uniform1i;


function Uniform1i(context, name, location, size) {
    Uniform.call(this, context, name, location, size);
}
Uniform.extend(Uniform1i);

Uniform1i.prototype.set = function(value, force) {
    var context = this.context;

    if (force || context.__programForce || this.value !== value) {
        context.gl.uniform1i(this.location, value);
        this.value = value;
    }

    return this;
};
