var Attribute = require("./Attribute");


module.exports = Attribute3f;


function Attribute3f(context, name, location) {
    Attribute.call(this, context, name, location);
}
Attribute.extend(Attribute3f);

Attribute3f.prototype.set = function(buffer, offset, force) {
    var context = this.context,
        gl = context.gl;

    context.setAttribPointer(this.location, 3, gl.FLOAT, buffer.stride, offset, context.setArrayBuffer(buffer) || force);
    return this;
};
