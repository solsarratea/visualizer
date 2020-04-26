window.width = window.innerWidth;
window.height = window.innerHeight;

var camera, scene, renderer, geometry;
function setupScene() {
  camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);
  camera.position.y = 0;
  camera.position.z = 5;

  scene = new THREE.Scene();
  geometry = new THREE.PlaneBufferGeometry(5, 5);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

}

var material, plane;
function initScene() {
  material = new THREE.ShaderMaterial({
    uniforms: {
      "time": { value: 0.0 },
      "resolution": { type: "v2", value: new THREE.Vector2() },
      "camY": { type: "f", value: -0.131 },
      "camX": { type: "f", value: -0.092 },
      "camZ": { type: "f", value: -1.575 },
      "zoom": { type: "f", value: zoom },
      "colorA": { type: 'v3', value: colorA },
      "colorB": { type: 'v3', value: colorB },
      "t": { type: "f", value: saturation },
      "power": { type: "f", value: power },
      "rotate": { type: "f", value: rotate },
      "bailout": { type: "f", value: bailout },
      "light": { type: "f", value: brightness },
    },
    fragmentShader: document.getElementById('mandelbulbFragmentShader').textContent,
    vertexShader: document.getElementById('vertexShader').textContent,

  });

  plane = new THREE.Mesh(geometry, material);
  scene.add(plane);

}


window.guiData = {
  "zoom": -1.13,
  "colorA": {
    "r": 255,
    "g": 78.0140625,
    "b": 78.0140625
  },
  "colorB": {
    "r": 195,
    "g": 255,
    "b": 0
  },
  "saturation": 0.6,
  "power": 8.,
  "rotate": 6.,
  "bailout": 10.,
  "light": 2.,
};


window.zoom = -1.13;
window.colorA = new THREE.Color(255, 48, 48);
window.colorB = new THREE.Color(195,255, 0);
window.power = 8;
window.rotate = 6.;
window.bailout = 10.;
window.brightness = 2.;
window.saturation = 0.6;

var gui, colorF;
function addGuiControls() {
  gui = new dat.GUI({ load: guiData });
  gui.remember(this);

  gui.add(this, 'bailout', 5., 25.).step(0.1);
  gui.add(this, 'power', 0., 17.).step(0.0001);
  gui.add(this, 'rotate', 0., 30.).step(0.5);
  colorF = gui.addFolder("Colorize")
  colorF.add(this, 'brightness', 0., 4.).step(0.001);
  colorF.add(this, 'saturation', 0., 1.).step(0.001);
  colorF.addColor(this, 'colorA');
  colorF.addColor(this, 'colorB');
}


var rotationFlag, domEvents, controls, dragControls;
function addControls() {
  rotationFlag = false;
  domEvents = new THREEx.DomEvents(camera, renderer.domElement);
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableRotate = false;
  dragControls = new THREE.DragControls([plane], camera, renderer.domElement);

  dragControls.addEventListener('dragstart', function (event) {
    if (rotationFlag) {
      dragControls.deactivate();
    }
  });

  domEvents.addEventListener(plane, 'dblclick', function (event) {
    console.log("clicking", event)
    rotationFlag = !rotationFlag;
    if (!rotationFlag) {
      dragControls.activate();
    }
  }, false)
}

function onWindowResize() {
  width = window.innerWidth;
  height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

function render() {
  renderer.render(scene, camera);
  requestAnimationFrame(render);

  var time = performance.now() * 0.0005;
  material.uniforms["time"].value = time;

  material.uniforms["zoom"].value = zoom;
  material.uniforms["colorA"].value = colorA;
  material.uniforms["colorB"].value = colorB;
  material.uniforms["t"].value = saturation;
  material.uniforms["power"].value = power;

  material.uniforms["light"].value = brightness;
  material.uniforms["bailout"].value = bailout;
  if (rotationFlag) {
    material.uniforms["rotate"].value += 0.001;
    rotate = material.uniforms["rotate"].value;
  } else {
    material.uniforms["rotate"].value = rotate;
  }
}

window.addEventListener('resize', onWindowResize, false);
setupScene();
initScene();
addControls();
addGuiControls();
render();
