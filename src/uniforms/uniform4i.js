var vec4 = require("vec4"),
    Uniform = require("./uniform");


module.exports = Uniform4i;


function Uniform4i(context, name, location, size) {
    Uniform.call(this, context, name, location, size);
    this.value = size === 1 ? vec4.create(NaN, NaN, NaN, NaN) : null;
}
Uniform.extend(Uniform4i);

Uniform4i.prototype.set = function(value, force) {
    var context = this.context;

    if (force || context.__programForce) {
        if (this.size === 1) {
            if (vec4.notEqual(this.value, value)) {
                context.gl.uniform4i(this.location, value[0], value[1], value[2], value[3]);
                vec4.copy(this.value, value);
            }
        } else {
            context.gl.uniform4iv(this.location, value);
        }
    }

    return this;
};
