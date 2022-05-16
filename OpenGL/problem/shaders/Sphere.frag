precision mediump float;

varying vec4 v_Color;
varying vec4 v_Normal;

uniform vec3 u_LightDirection;
uniform vec3 u_LightColor;
uniform vec3 u_AmbientLight;

void main() {
    vec3 light = normalize(u_LightDirection);
    vec3 normal = normalize(v_Normal.xyz);
    vec3 diffuse = (max(dot(light, normal), 0.0)) * u_LightColor;
    vec3 color = v_Color.xyz;
	gl_FragColor = vec4((u_AmbientLight + diffuse) * color ,v_Color.w);
}
