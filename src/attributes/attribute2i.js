var Attribute = require("./attribute");


module.exports = Attribute2i;


function Attribute2i(context, name, location) {
    Attribute.call(this, context, name, location);
}
Attribute.extend(Attribute2i);

Attribute2i.prototype.set = function(buffer, offset) {
    var context = this.context,
        gl = context.gl;

    context.setArrayBuffer(this.location, buffer, 2, gl.FLOAT, offset);
    return this;
};
