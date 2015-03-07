var mat3 = require("mat3"),
    Uniform = require("./uniform");


module.exports = UniformMatrix3fv;


function UniformMatrix3fv(context, name, location, size) {
    Uniform.call(this, context, name, location, size);
    this.value = size === 1 ? mat3.create(
        NaN, NaN, NaN,
        NaN, NaN, NaN,
        NaN, NaN, NaN
    ) : null;
}
Uniform.extend(UniformMatrix3fv);

UniformMatrix3fv.prototype.set = function(value, force) {
    var context = this.context;

    if (force || context.__programForce) {
        if (this.size === 1) {
            if (mat3.notEqual(this.value, value)) {
                context.gl.uniformMatrix3fv(this.location, false, value);
                mat3.copy(this.value, value);
            }
        } else {
            context.gl.uniformMatrix3fv(this.location, false, value);
        }
    }

    return this;
};
