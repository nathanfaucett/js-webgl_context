var mat2 = require("mat2"),
    Uniform = require("./uniform");


module.exports = UniformMatrix2fv;


function UniformMatrix2fv(context, name, location, size) {
    Uniform.call(this, context, name, location, size);
    this.value = size === 1 ? mat2.create(NaN, NaN, NaN, NaN) : null;
}
Uniform.extend(UniformMatrix2fv);

UniformMatrix2fv.prototype.set = function(value, force) {
    var context = this.context;

    if (force || context.__programForce) {
        if (this.size === 1) {
            if (mat2.notEqual(this.value, value)) {
                context.gl.uniformMatrix2fv(this.location, false, value);
                mat2.copy(this.value, value);
            }
        } else {
            context.gl.uniformMatrix2fv(this.location, false, value);
        }
    }

    return this;
};
