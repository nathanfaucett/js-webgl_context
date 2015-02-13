var Attribute = require("./attribute");


module.exports = Attribute2f;


function Attribute2f(context, name, location) {
    Attribute.call(this, context, name, location);
}
Attribute.extend(Attribute2f);

Attribute2f.prototype.set = function(buffer, offset) {
    var context = this.context,
        gl = context.gl;

    context.setArrayBuffer(this.location, buffer, 2, gl.FLOAT, offset);
    return this;
};
