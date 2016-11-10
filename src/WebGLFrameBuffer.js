var WebGLFrameBufferPrototype;


module.exports = WebGLFrameBuffer;


function WebGLFrameBuffer(context, framebuffer) {
    var _this = this;

    this.context = context;

    this.__lastTexture = null;
    this.isCubeMap = false;
    this.framebuffer = framebuffer;

    this.needsCompile = true;

    this.glFrameBuffer = null;
    this.glRenderBuffer = null;

    framebuffer.on("update", function() {
        _this.needsCompile = true;
    });
}
WebGLFrameBufferPrototype = WebGLFrameBuffer.prototype;

function WebGLFrameBuffer_needsCompile(_this) {
    var context = _this.context,
        framebuffer = _this.framebuffer,
        texture = framebuffer.texture;

    return (
        _this.needsCompile ||
        _this.__lastTexture !== texture ||
        context.createTexture(texture).needsCompile
    );
}

WebGLFrameBufferPrototype.destroy = function() {
    var glFrameBuffer = this.glFrameBuffer,
        glRenderBuffer = this.glRenderBuffer,
        gl, i;

    if (glFrameBuffer && glRenderBuffer) {
        gl = this.context.gl;

        if (this.isCubeMap) {
            i = 6;
            while (i--) {
                gl.deleteFramebuffer(glFrameBuffer[i]);
                gl.deleteRenderbuffer(glRenderBuffer[i]);
            }
        } else {
            gl.deleteFramebuffer(glFrameBuffer);
            gl.deleteRenderbuffer(glRenderBuffer);
        }

        this.glFrameBuffer = null;
        this.glRenderBuffer = null;
        this.needsCompile = true;
    }

    return this;
};

WebGLFrameBufferPrototype.getGLFrameBuffer = function() {
    if (WebGLFrameBuffer_needsCompile(this)) {
        return WebGLFrameBuffer_compile(this).glFrameBuffer;
    } else {
        return this.glFrameBuffer;
    }
};

WebGLFrameBufferPrototype.getGLRenderBuffer = function() {
    if (WebGLFrameBuffer_needsCompile(this)) {
        return WebGLFrameBuffer_compile(this).glRenderBuffer;
    } else {
        return this.glRenderBuffer;
    }
};

function WebGLFrameBuffer_compile(_this) {
    var context = _this.context,
        gl = context.gl,

        framebuffer = _this.framebuffer,
        depthBuffer = framebuffer.depthBuffer,
        stencilBuffer = framebuffer.stencilBuffer,

        texture = framebuffer.texture,
        webglTexture = context.createTexture(texture),

        glTexture = webglTexture.getGLTexture(),

        isCubeMap = webglTexture.isCubeMap,

        width = webglTexture.getWidth(),
        height = webglTexture.getHeight(),

        glFrameBuffer, glRenderBuffer, i;

    if (isCubeMap) {
        glFrameBuffer = new Array(6);
        glRenderBuffer = new Array(6);
    }

    if (isCubeMap) {
        i = 6;
        while (i--) {
            glFrameBuffer[i] = gl.createFramebuffer();
            glRenderBuffer[i] = gl.createRenderbuffer();

            setupFrameBuffer(gl, glFrameBuffer[i], gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, glTexture);
            setupRenderBuffer(gl, glRenderBuffer[i], width, height, depthBuffer, stencilBuffer);
        }
    } else {
        glFrameBuffer = gl.createFramebuffer();
        glRenderBuffer = gl.createRenderbuffer();

        setupFrameBuffer(gl, glFrameBuffer, gl.TEXTURE_2D, glTexture);
        setupRenderBuffer(gl, glRenderBuffer, width, height, depthBuffer, stencilBuffer);
    }

    _this.__lastTexture = texture;
    _this.glFrameBuffer = glFrameBuffer;
    _this.glRenderBuffer = glRenderBuffer;
    _this.isCubeMap = isCubeMap;

    _this.needsCompile = false;

    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    return _this;
}

function setupFrameBuffer(gl, glFrameBuffer, glTextureTarget, glTexture) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, glFrameBuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, glTextureTarget, glTexture, 0);
}

function setupRenderBuffer(gl, glRenderBuffer, width, height, depthBuffer, stencilBuffer) {
    gl.bindRenderbuffer(gl.RENDERBUFFER, glRenderBuffer);

    if (depthBuffer && !stencilBuffer) {

        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, glRenderBuffer);
        /* Not working. Defaulting to RGBA4.
        } else if (!depthBuffer && stencilBuffer) {
            
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.STENCIL_INDEX8, width, height);
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.STENCIL_ATTACHMENT, gl.RENDERBUFFER, glRenderBuffer);
        */
    } else if (depthBuffer && stencilBuffer) {

        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, width, height);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, glRenderBuffer);

    } else {
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.RGBA4, width, height);
    }
}