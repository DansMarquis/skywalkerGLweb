/*
    Authors:
    - Daniel Marques 85070
    - Tomás Freitas  84957
*/
var TEXTURE = {
    getTexture: function(GL, imageURL) {
        var image = new Image();
        image.crossOrigin = "Anonymous";
        image.src = imageURL;
        image.webglTexture = false;

        image.onload = function() {
            var texture = GL.createTexture(); // Texture is created
            GL.pixelStorei(GL.UNPACK_FLIP_Y_WEBGL, true); // Invert vertical pixel order
            GL.bindTexture(GL.TEXTURE_2D, texture); // Link with the context
            GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, image); // Data image data is sent to texture
            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR); // Magnification filter is set
            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.NEAREST_MIPMAP_LINEAR); // Reduction filter is set
            GL.generateMipmap(GL.TEXTURE_2D); // Distinct textures are generated to distinct resolutions
            GL.bindTexture(GL.TEXTURE_2D, null); // Context released
            image.webglTexture = texture;

        };

        image.crossOrigin = "Anonymous";
        image.src = imageURL;
        image.webglTexture = false;
        return image;
    }
};