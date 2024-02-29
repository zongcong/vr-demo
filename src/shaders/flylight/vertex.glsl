precision lowp float;

varying vec4 vPosition;
varying vec4 vgPostion;

void main() {
    vgPostion = vec4(position, 1.0);
    vec4 modelPosition = modelMatrix * vgPostion;
    vPosition = modelPosition;

    gl_Position = projectionMatrix * viewMatrix * modelPosition;
}
