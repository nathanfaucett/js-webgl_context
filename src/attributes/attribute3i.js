var Attribute = require("./attribute");


module.exports = Attribute3i;


function Attribute3i(context, name, location) {
    Attribute.call(this, context, name, location);
}
Attribute.extend(Attribute3i);

Attribute3i.prototype.set = function(buffer, offset) {
    var context = this.context,
        gl = context.gl;

    context.setArrayBuffer(this.location, buffer, 3, gl.FLOAT, offset);
    return this;
};
