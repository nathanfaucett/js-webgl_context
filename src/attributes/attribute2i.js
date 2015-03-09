var Attribute = require("./attribute");


module.exports = Attribute2i;


function Attribute2i(context, name, location) {
    Attribute.call(this, context, name, location);
}
Attribute.extend(Attribute2i);

Attribute2i.prototype.set = function(buffer, offset, force) {
    var context = this.context,
        gl = context.gl;

    context.setAttribPointer(this.location, 2, gl.FLOAT, buffer.stride, offset, context.setArrayBuffer(buffer) || force);
    return this;
};
