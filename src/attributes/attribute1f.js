var Attribute = require("./attribute");


module.exports = Attribute1f;


function Attribute1f(context, name, location) {
    Attribute.call(this, context, name, location);
}
Attribute.extend(Attribute1f);

Attribute1f.prototype.set = function(buffer, offset) {
    var context = this.context,
        gl = context.gl;

    context.setArrayBuffer(this.location, buffer, 1, gl.FLOAT, offset);
    return this;
};
