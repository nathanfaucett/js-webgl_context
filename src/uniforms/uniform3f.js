var vec3 = require("vec3"),
    Uniform = require("./uniform");


module.exports = Uniform3f;


function Uniform3f(context, name, location) {
    Uniform.call(this, context, name, location);
    this.value = vec3.create(NaN, NaN, NaN);
}
Uniform.extend(Uniform3f);

Uniform3f.prototype.set = function(value, force) {
    var context = this.context;

    if (force || context.__programForce || vec3.notEqual(this.value, value)) {
        context.gl.uniform3f(this.location, value[0], value[1], value[2]);
        vec3.copy(this.value, value);
    }

    return this;
};
