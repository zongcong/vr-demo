precision lowp float;

varying vec2 vUv;
varying float vElevation;

uniform sampler2D uTexture;

void main() {
   float height = vElevation + 0.05 * 15.0;
   // 根据UV取出对应的颜色
   vec4 textureColor = texture2D(uTexture, vUv);
   textureColor.rgb *= height;
   gl_FragColor = textureColor;

}
