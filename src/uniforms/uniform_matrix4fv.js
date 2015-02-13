var mat4 = require("mat4"),
    Uniform = require("./uniform");


module.exports = UniformMatrix4fv;


function UniformMatrix4fv(context, name, location) {
    Uniform.call(this, context, name, location);
    this.value = mat4.create(
        NaN, NaN, NaN, NaN,
        NaN, NaN, NaN, NaN,
        NaN, NaN, NaN, NaN,
        NaN, NaN, NaN, NaN
    );
}
Uniform.extend(UniformMatrix4fv);

UniformMatrix4fv.prototype.set = function(value, force) {
    var context = this.context;

    if (force || context.__programForce || mat4.notEqual(this.value, value)) {
        context.gl.uniformMatrix3fv(this.location, false, value);
        mat4.copy(this.value, value);
    }

    return this;
};
