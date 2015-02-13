module.exports = {
    BOOL: require("./uniform1b"),
    INT: require("./uniform1i"),
    FLOAT: require("./uniform1f"),

    BOOL_VEC2: require("./uniform2i"),
    BOOL_VEC3: require("./uniform3i"),
    BOOL_VEC4: require("./uniform4i"),

    INT_VEC2: require("./uniform2i"),
    INT_VEC3: require("./uniform3i"),
    INT_VEC4: require("./uniform4i"),

    FLOAT_VEC2: require("./uniform2f"),
    FLOAT_VEC3: require("./uniform3f"),
    FLOAT_VEC4: require("./uniform4f"),

    FLOAT_MAT2: require("./uniform_matrix2fv"),
    FLOAT_MAT3: require("./uniform_matrix3fv"),
    FLOAT_MAT4: require("./uniform_matrix4fv"),

    SAMPLER_2D: require("./uniform_texture"),
    SAMPLER_CUBE: require("./uniform_texture_cube")
};
