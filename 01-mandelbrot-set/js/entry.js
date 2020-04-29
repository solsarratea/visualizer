var camera, renderer,scene, domEevents,controls,dragControls;
function setupScene(){
  camera = new THREE.PerspectiveCamera(45, window.innerWidth/ window.innerHeight, 0.01, 1000);
  camera.position.y = 0;
  camera.position.z = 10;
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  
  domEvents = new THREEx.DomEvents(camera, renderer.domElement);
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableRotate = false;
  controls.minDistance = 0.025;
  controls.maxDistance = 44;
  window.controls = controls;
}


function onWindowResize() {
  camera.aspect = window.innerWidth/ window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}


var geometry, materials, plane;
function initScene(){
  geometry = new THREE.PlaneBufferGeometry(1.3, 1);
  
  material = new THREE.ShaderMaterial({
    uniforms: {
      "time": { value: 0.0 },
      "orX": { type: "f", value: guiData.orX },
      "orY": { type: "f", value: guiData.orY },
      "t": { type: "f", value: guiData.rainbowAmount },
      "scale": { type: "f", value: guiData.scale },
      "zoom": { type: "f", value: guiData.zoom },
      "colorA": { type: 'v3', value: colorA },
      "colorB": { type: 'v3', value: colorB },
      "colorC": { type: 'v3', value: colorC },
      "colorD": { type: 'v3', value: colorD },
      "colorD": { type: 'v3', value: colorD },
      "iterations": { type: "f", value: guiData.scapeRadius },
  
      
    },
    fragmentShader: document.getElementById('mandelbrotFragmentShader').textContent,
    vertexShader: document.getElementById('vertexShader').textContent,
    
  });
  plane = new THREE.Mesh(geometry, material);
  scene.add(plane);
  dragControls = new THREE.DragControls([plane], camera, renderer.domElement);
}

window.colorA = new THREE.Color(65,52,170);
window.colorB = new THREE.Color(56,145,87);
window.colorC = new THREE.Color(162,73,63);
window.colorD = new THREE.Color(247,247,247);
window.rainbowAmount = 1;
window.scapeRadius = 2.;
window.zoom = -1.5;
window.iterations = 100;
window.orX=0.;
window.orY=0.;
window.scale=0.69;

var gui, zoomF, colorF;
function  addGuiControls(){
    gui = new dat.GUI({load: guiData});
    zoomF = gui.addFolder("Zoom");
    colorF = gui.addFolder("Colorize")
      gui.remember(this);
      colorF.addColor(this, 'colorA');
      colorF.addColor(this, 'colorB');
      colorF.addColor(this, 'colorC');
      colorF.addColor(this, 'colorD');
      gui.add(this, 'scapeRadius', -.5, 3.).step(0.01);
      gui.add(this, 'iterations', 10, 300).step(0.1);
      colorF.add(this, 'rainbowAmount', 0., 1.).step(0.0001);
      zoomF.add(this, 'zoom', -1.5, 100.).step(1);
      zoomF.add(this, 'orX', -200., 100.).step(0.0001);
      zoomF.add(this, 'orY', -200., 100.).step(0.0001);
}      


function render() {
  var time = performance.now() * 0.0005;
  material.uniforms["time"].value = time;
  material.uniforms["colorA"].value = colorA;
  material.uniforms["colorB"].value = colorB;
  material.uniforms["colorC"].value = colorC;
  material.uniforms["colorD"].value = colorD;
  material.uniforms.iterations.value = scapeRadius;
  material.uniforms["t"].value = rainbowAmount;
  material.uniforms["orX"].value = orX/(zoom+2.5);
  material.uniforms["orY"].value = orY/(zoom+2.5);
  material.uniforms["scale"].value = scale;
  material.uniforms["zoom"].value = zoom;
  plane.scale.x = window.innerHeight * 0.01 * 1 / 1.2;
  plane.scale.y = window.innerHeight * 0.01;

  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

window.addEventListener('resize', onWindowResize, false);

setupScene();
initScene();
render();
addGuiControls();