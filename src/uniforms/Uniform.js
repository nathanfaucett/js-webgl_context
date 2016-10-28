var inherits = require("@nathanfaucett/inherits");


module.exports = Uniform;


function Uniform(context, name, location, size) {
    this.name = name;
    this.location = location;
    this.context = context;
    this.size = size;
    this.value = null;
}

Uniform.extend = function(child) {
    return inherits(child, this);
};

Uniform.prototype.set = function( /* value, force */ ) {
    return this;
};
