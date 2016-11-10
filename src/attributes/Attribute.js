var inherits = require("@nathanfaucett/inherits");


module.exports = Attribute;


function Attribute(context, name, location) {
    this.name = name;
    this.location = location;
    this.context = context;
}

Attribute.extend = function(child) {
    return inherits(child, this);
};

Attribute.prototype.set = function( /* buffer, offset, force */ ) {
    return this;
};