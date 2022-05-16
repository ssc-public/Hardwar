precision mediump float;
attribute vec3 a_Position;
attribute vec4 a_Color;
attribute vec3 a_Normal;
varying vec4 v_Color;
varying vec4 v_Normal;

uniform mat4 u_Model;
uniform mat4 u_WorldRotation;
uniform mat4 u_World;
uniform mat4 u_View;
uniform mat4 u_Camera;
uniform mat4 u_Projection;

void main() {
	vec4 temp_position = vec4(a_Position, 1.0);
	gl_Position = u_Projection * u_Camera * u_View * u_World * u_Model * temp_position;
	v_Color = a_Color;
	v_Normal = u_WorldRotation * u_Model * vec4(a_Normal, 1);
}
