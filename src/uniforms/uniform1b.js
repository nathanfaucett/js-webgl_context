var Uniform = require("./uniform");


module.exports = Uniform1b;


function Uniform1b(context, name, location, size) {
    Uniform.call(this, context, name, location, size);
}
Uniform.extend(Uniform1b);

Uniform1b.prototype.set = function(value, force) {
    var context = this.context;

    if (force || context.__programForce) {
        if (this.size === 1) {
            if (this.value !== value) {
                context.gl.uniform1i(this.location, value);
                this.value = value;
            }
        } else {
            context.gl.uniform1iv(this.location, value);
        }
    }

    return this;
};
