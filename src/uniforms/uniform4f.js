var vec4 = require("vec4"),
    Uniform = require("./uniform");


module.exports = Uniform4f;


function Uniform4f(context, name, location) {
    Uniform.call(this, context, name, location);
    this.value = vec4.create(NaN, NaN, NaN, NaN);
}
Uniform.extend(Uniform4f);

Uniform4f.prototype.set = function(value, force) {
    var context = this.context;

    if (force || context.__programForce || vec4.notEqual(this.value, value)) {
        context.gl.uniform4f(this.location, value[0], value[1], value[2], value[3]);
        vec4.copy(this.value, value);
    }

    return this;
};
