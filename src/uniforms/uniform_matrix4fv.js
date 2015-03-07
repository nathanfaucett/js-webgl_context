var mat4 = require("mat4"),
    Uniform = require("./uniform");


module.exports = UniformMatrix4fv;


function UniformMatrix4fv(context, name, location, size) {
    Uniform.call(this, context, name, location, size);
    this.value = size === 1 ? mat4.create(
        NaN, NaN, NaN, NaN,
        NaN, NaN, NaN, NaN,
        NaN, NaN, NaN, NaN,
        NaN, NaN, NaN, NaN
    ) : null;
}
Uniform.extend(UniformMatrix4fv);

UniformMatrix4fv.prototype.set = function(value, force) {
    var context = this.context;

    if (force || context.__programForce) {
        if (this.size === 1) {
            if (mat4.notEqual(this.value, value)) {
                context.gl.uniformMatrix4fv(this.location, false, value);
                mat4.copy(this.value, value);
            }
        } else {
            context.gl.uniformMatrix4fv(this.location, false, value);
        }
    }

    return this;
};
