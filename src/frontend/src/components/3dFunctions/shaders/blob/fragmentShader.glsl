/*
 * Filename: c:\Users\Tobias\Desktop\Master Medieninformatik\master_projekt\Digitales-3D-Feldbuch-Projekt-3-\src\frontend\src\components\3dFunctions\shaders\blob\fragmentShader.glsl
 * Path: c:\Users\Tobias\Desktop\Master Medieninformatik\master_projekt\Digitales-3D-Feldbuch-Projekt-3-\src\frontend
 * Created Date: Thursday, April 4th 2024, 11:30:46 pm
 * Author: Tobias Mink
 * 
 * Copyright (c) 2024 Your Company
 */

uniform vec2 u_resolution;
  
void main() {
  vec2 st = gl_FragCoord.xy / u_resolution;
          
  gl_FragColor =  vec4( vec3(st.x, st.y, 1.0), 1.0 );
}