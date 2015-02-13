var mat3 = require("mat3"),
    Uniform = require("./uniform");


module.exports = UniformMatrix3fv;


function UniformMatrix3fv(context, name, location) {
    Uniform.call(this, context, name, location);
    this.value = mat3.create(
        NaN, NaN, NaN,
        NaN, NaN, NaN,
        NaN, NaN, NaN
    );
}
Uniform.extend(UniformMatrix3fv);

UniformMatrix3fv.prototype.set = function(value, force) {
    var context = this.context;

    if (force || context.__programForce || mat3.notEqual(this.value, value)) {
        context.gl.uniformMatrix3fv(this.location, false, value);
        mat3.copy(this.value, value);
    }

    return this;
};
