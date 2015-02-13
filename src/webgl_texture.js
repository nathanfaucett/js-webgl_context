var isArray = require("is_array"),
    enums = require("./enums/index");


var TextureType = enums.TextureType,
    FilterMode = enums.FilterMode;


module.exports = WebGLTexture;


function WebGLTexture(context) {

    this.context = context;

    this.isCubeMap = false;
    this.needsCompile = true;
    this.glTexture = null;
}

WebGLTexture.prototype.compile = function(options) {
    var context = this.context,
        gl = context.gl,

        glTexture = this.glTexture || (this.glTexture = gl.createTexture()),

        image = options.data,
        notNull = image != null,
        isCubeMap = isArray(image),

        width = options.width,
        height = options.height,
        isPOT = mathf.isPowerOfTwo(width) && mathf.isPowerOfTwo(height),

        generateMipmap = options.generateMipmap,
        flipY = options.flipY,
        premultiplyAlpha = options.premultiplyAlpha,
        anisotropy = options.anisotropy,
        filter = options.filter,
        format = options.format,
        wrap = isPOT ? options.wrap : gl.CLAMP_TO_EDGE,
        textureType = options.type,

        TFA = (anisotropy > 0) && context.getExtension("EXT_texture_filter_anisotropic"),
        TEXTURE_TYPE = isCubeMap ? gl.TEXTURE_CUBE_MAP : gl.TEXTURE_2D,
        minFilter, magFilter, images, i, il;

    if (TFA) {
        anisotropy = clamp(anisotropy, 1, context.__maxAnisotropy);
    }

    if (notNull) {
        if (isCubeMap) {
            images = [];
            i = -1;
            il = image.length - 1;

            while (i++ < il) {
                images[i] = context.clampMaxSize(image[i], isCubeMap);
            }
        } else {
            image = context.clampMaxSize(image, false);
        }
    }

    if (filter === FilterMode.None) {
        magFilter = gl.NEAREST;
        minFilter = isPOT && generateMipmap ? gl.LINEAR_MIPMAP_NEAREST : gl.NEAREST;
    } else { //FilterMode.Linear
        magFilter = gl.LINEAR;
        minFilter = isPOT && generateMipmap ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR;
    }

    if (
        (textureType === TextureType.Float && !context.getExtension("OES_texture_float")) ||
        (textureType === TextureType.DepthComponent && !context.getExtension("WEBGL_depth_texture"))
    ) {
        textureType = gl.UNSIGNED_BYTE;
    }

    gl.bindTexture(TEXTURE_TYPE, glTexture);

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flipY ? 1 : 0);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, premultiplyAlpha ? 1 : 0);

    if (notNull) {
        if (isCubeMap) {
            i = images.length;
            while (i--) {
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, format, format, textureType, images[i]);
            }
        } else {
            gl.texImage2D(TEXTURE_TYPE, 0, format, format, textureType, image);
        }
    } else {
        if (isCubeMap) {
            i = image.length;
            while (i--) {
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, format, width, height, 0, format, textureType, null);
            }
        } else {
            if (textureType === TextureType.DepthComponent) {
                gl.texImage2D(TEXTURE_TYPE, 0, textureType, width, height, 0, textureType, gl.UNSIGNED_SHORT, null);
            } else {
                gl.texImage2D(TEXTURE_TYPE, 0, format, width, height, 0, format, textureType, null);
            }
        }
    }

    gl.texParameteri(TEXTURE_TYPE, gl.TEXTURE_MAG_FILTER, magFilter);
    gl.texParameteri(TEXTURE_TYPE, gl.TEXTURE_MIN_FILTER, minFilter);

    gl.texParameteri(TEXTURE_TYPE, gl.TEXTURE_WRAP_S, wrap);
    gl.texParameteri(TEXTURE_TYPE, gl.TEXTURE_WRAP_T, wrap);

    if (TFA) {
        gl.texParameterf(TEXTURE_TYPE, TFA.TEXTURE_MAX_ANISOTROPY_EXT, anisotropy);
    }
    if (generateMipmap && isPOT) {
        gl.generateMipmap(TEXTURE_TYPE);
    }

    this.isCubeMap = isCubeMap;
    this.needsCompile = false;

    gl.bindTexture(TEXTURE_TYPE, null);

    return this;
};
