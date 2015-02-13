var mat2 = require("mat2"),
    Uniform = require("./uniform");


module.exports = UniformMatrix2fv;


function UniformMatrix2fv(context, name, location) {
    Uniform.call(this, context, name, location);
    this.value = mat2.create(NaN, NaN, NaN, NaN);
}
Uniform.extend(UniformMatrix2fv);

UniformMatrix2fv.prototype.set = function(value, force) {
    var context = this.context;

    if (force || context.__programForce || mat2.notEqual(this.value, value)) {
        context.gl.uniformMatrix2fv(this.location, false, value);
        mat2.copy(this.value, value);
    }

    return this;
};
