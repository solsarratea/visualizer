var width = window.innerWidth;
var height = window.innerHeight;

var camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);
camera.position.y = 0;
camera.position.z = 10;

scene = new THREE.Scene();
var geometry = new THREE.PlaneBufferGeometry(1,1);

var startTime = Date.now();

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


var gui = new dat.GUI();
var guiData = {
  "orX": 1.5, 
  "orY": 1.3,
  "scale": 2.7,
  "zoom": -1.5,
  "colorA": [65,52,170],
  "colorB": [247,247,247],
  "colorD": [162,73,73],
  "colorC": [247,247,247],
  "rainbowAmount": 1,
};


gui.addColor(guiData,'colorA');
gui.addColor(guiData,'colorB');
gui.addColor(guiData,'colorC');
gui.addColor(guiData,'colorD');
gui.add(guiData, 'rainbowAmount',0.,1.).step(0.0001);
gui.close();

var colorA = new THREE.Vector3( guiData.colorA[ 0 ], guiData.colorA[ 1 ], guiData.colorA[ 2 ] );
var colorB = new THREE.Vector3( guiData.colorB[ 0 ], guiData.colorB[ 1 ], guiData.colorB[ 2 ] );
var colorC = new THREE.Vector3( guiData.colorA[ 0 ], guiData.colorA[ 1 ], guiData.colorA[ 2 ] );
var colorD = new THREE.Vector3( guiData.colorB[ 0 ], guiData.colorB[ 1 ], guiData.colorB[ 2 ] );


material = new THREE.ShaderMaterial( {
  uniforms: {
    "time": { value: 0.0 },
    "orX": { type: "f", value: guiData.orX },
    "orY": { type: "f", value: guiData.orY },
    "t": { type: "f", value: guiData.rainbowAmount },
    "scale": { type: "f", value: guiData.scale },
    "zoom": { type: "f", value: guiData.zoom },
    "colorA" : { type : 'v3', value : colorA },
    "colorB" : { type : 'v3', value : colorB },
    "colorC" : { type : 'v3', value : colorC },
    "colorD" : { type : 'v3', value : colorD },

  },
  fragmentShader: document.getElementById( 'mandelbrotFragmentShader' ).textContent,
  vertexShader: document.getElementById( 'vertexShader' ).textContent,

} );

var plane = new THREE.Mesh( geometry, material );
plane.scale.y = innerHeight*0.01;
plane.scale.x = innerHeight*0.01;
scene.add( plane );

//Add Controls
var domEvents	= new THREEx.DomEvents(camera, renderer.domElement);
var controls = new THREE.OrbitControls(camera, renderer.domElement);  
controls.enableRotate = false;
var dragControls = new THREE.DragControls( [plane], camera, renderer.domElement );


function onWindowResize() {
    width = window.innerWidth;
    height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

function animate() {
  

    var time = performance.now() * 0.0005;
    material.uniforms[ "time" ].value = time;
    material.uniforms[ "colorA" ].value = guiData.colorA;
    material.uniforms[ "colorB" ].value = guiData.colorB;
    material.uniforms[ "colorC" ].value = guiData.colorC;
    material.uniforms[ "colorD" ].value = guiData.colorD;
    material.uniforms[ "t" ].value = guiData.rainbowAmount;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  } 

window.addEventListener('resize', onWindowResize, false);
animate();