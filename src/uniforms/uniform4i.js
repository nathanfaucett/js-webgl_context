var vec4 = require("vec4"),
    Uniform = require("./uniform");


module.exports = Uniform4i;


function Uniform4i(context, name, location) {
    Uniform.call(this, context, name, location);
    this.value = vec4.create(NaN, NaN, NaN, NaN);
}
Uniform.extend(Uniform4i);

Uniform4i.prototype.set = function(value, force) {
    var context = this.context;

    if (force || context.__programForce || vec4.notEqual(this.value, value)) {
        context.gl.uniform4i(this.location, value[0], value[1], value[2], value[3]);
        vec4.copy(this.value, value);
    }

    return this;
};
