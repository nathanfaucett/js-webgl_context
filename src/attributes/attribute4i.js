var Attribute = require("./attribute");


module.exports = Attribute4i;


function Attribute4i(context, name, location) {
    Attribute.call(this, context, name, location);
}
Attribute.extend(Attribute4i);

Attribute4i.prototype.set = function(buffer, offset) {
    var context = this.context,
        gl = context.gl;

    context.setArrayBuffer(this.location, buffer, 4, gl.FLOAT, offset);
    return this;
};
