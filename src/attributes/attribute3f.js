var Attribute = require("./attribute");


module.exports = Attribute3f;


function Attribute3f(context, name, location) {
    Attribute.call(this, context, name, location);
}
Attribute.extend(Attribute3f);

Attribute3f.prototype.set = function(value, stride, offset) {
    var context = this.context,
        gl = context.gl,
        location = this.location;

    if (location !== -1) {
        gl.bindBuffer(gl.ARRAY_BUFFER, value);
        context.enableAttribute(location);
        gl.vertexAttribPointer(location, 3, gl.FLOAT, gl.FALSE, stride, offset);
    }

    return this;
};
