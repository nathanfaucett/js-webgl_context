var vec3 = require("vec3"),
    Uniform = require("./uniform");


module.exports = Uniform3i;


function Uniform3i(context, name, location) {
    Uniform.call(this, context, name, location);
    this.value = vec3.create(NaN, NaN, NaN);
}
Uniform.extend(Uniform3i);

Uniform3i.prototype.set = function(value, force) {
    var context = this.context;

    if (force || context.__programForce || vec3.notEqual(this.value, value)) {
        context.gl.uniform3i(this.location, value[0], value[1], value[2]);
        vec3.copy(this.value, value);
    }

    return this;
};
