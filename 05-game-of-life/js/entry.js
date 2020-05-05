
var scene, camera, renderer, width, height, controls, dragControls;
function setupMainScene() {
  scene = new THREE.Scene();
  var width = window.innerWidth;
  var height = window.innerHeight;
  camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, 1, 1000);
  camera.position.z = 2;
  camera.position.set(0, 150, 300);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
}

var bufferScene, textureA, textureB, startText;
function setupBufferScene() {

  bufferScene = new THREE.Scene();

  textureA = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearMipMapLinearFilter,
    format: THREE.RGBAFormat,
    type: THREE.FloatType
  });

  textureB = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearMipMapLinearFilter,
    format: THREE.RGBAFormat,
    type: THREE.FloatType
  });

  textureA.texture.wrapS = THREE.ClampToEdgeWrapping;
  textureA.texture.wrapT = THREE.ClampToEdgeWrapping;
  textureB.texture.wrapS = THREE.ClampToEdgeWrapping;
  textureB.texture.wrapT = THREE.ClampToEdgeWrapping;

  createTexture = new TextureFactory();
  createTexture.fromImage('/core/flor.jpg');
  startText = createTexture.texture;

}

var plane, bufferObject;
function initBufferScene() {

  bufferMaterial = new THREE.ShaderMaterial({
    uniforms: {
      start: { type: "t", value: startText },
      texture: { type: 't', value: textureA.texture },
      timer: { type: 'i', value: 0 },
      resolution: { type: 'v2', value: new THREE.Vector2() },
      mouse: { type: 'v2', value: new THREE.Vector2() },
      dT: { type: 'f', value: dT },
      t: { type: 'f', value: roundPos },
      pixelSize: { type: 'f', value: pixelSize },
      bound: { type: 'f', value: frame },
      rNeighbour: { type: 'f', value: rNeighbour },
      tNeighbour: { type: 'f', value: tNeighbour },
      threshold: { type: 'f', value: threshold },
      remember: { type: 'b', value: remember },
      travel: { type: 'bool', value: travel }

    },

    vertexShader: document.getElementById('vertexShader').innerHTML,
    fragmentShader: this.document.getElementById('fragShader').innerHTML
  });

  plane = new THREE.PlaneBufferGeometry(window.innerWidth, window.innerHeight);
  bufferObject = new THREE.Mesh(plane, bufferMaterial);
  bufferScene.add(bufferObject);

}


window.color1 = new THREE.Color(255, 255, 255);
window.color2 = new THREE.Color(0, 0, 0);
window.timer = 0;
window.mouse = { x: 0, y: 0 };
window.clear = 0;
window.iterations = 1;
window.roundPos = 0.5;
window.dT = 0.01;
window.pixelSize = 10.;
window.frame = 2.;
window.threshold = 0.2;
window.bound = 3.;
window.rNeighbour = 1.;
window.tNeighbour = 0.;
window.activate = 0;
window.remember = 0;
window.travel = 0;
window.t=0;



var finalMaterial, geom, quad;
function initFinalScene() {
  finalMaterial = new THREE.ShaderMaterial({
    uniforms: {
      resolution: { type: 'v2', value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      texture: { type: 't', value: textureB.texture, minFilter: THREE.NearestFilter },
      start: { type: "t", value: startText },
      color1: { type: 'c', value: color1 },
      color2: { type: 'c', value: color2 },
      activate: { type: 'f', value: activate },
      t: { type: 'f', value: 0. },
    },
    vertexShader: document.getElementById('vertexShader').innerHTML,
    fragmentShader: document.getElementById('color').textContent
  });

  geom = new THREE.PlaneBufferGeometry(window.innerWidth, window.innerHeight);
  quad = new THREE.Mesh(geom, finalMaterial);
  scene.add(quad);
}

window.guiData = {
  "remembered": {
    "default": {
      "0": {
        "color1": {
          "r": 0,
          "g": 0,
          "b": 0
        },
        "color2": {
          "r": 255,
          "g": 255,
          "b": 255
        },
        "iterations": 1,
        "roundPos": 0.5,
        "pixelSize": 16,
        "threshold": 0.631,
        "frame": 3,
        "bound": 3,
        "rNeighbour": 1.,
        "tNeighbour": 0.04
      }
    }
  },
  "preset": "default",
  "closed": false,
  "folders": {}
}

function addGuiControls() {
  var gui = new dat.GUI({ load: guiData });
  gui.remember(this);

  gui.addColor(this, "color1");
  gui.addColor(this, "color2");
  gui.add(this, "iterations", 0, 100).step(1);
  gui.add(this, "roundPos", -0.2, 1.).step(0.0001);
  gui.add(this, "pixelSize", 0.1, 100).step(1.);
  gui.add(this, "threshold", 0.01, 2.).step(0.001);
  gui.add(this, "frame", 1., 10.).step(1);
  gui.add(this, "bound", 1., 9.).step(1);;
  gui.add(this, "rNeighbour", 0., 2.).step(0.01);
  gui.add(this, "tNeighbour", -rNeighbour, rNeighbour).step(0.01);
  gui.add(this, "activate", 0, 1.).step(1.);
  gui.add(this, "t",0.,1.).step(0.01);

}


function setupEvents() {
  function updateMouse(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    mouse.x = evt.clientX - rect.left;
    mouse.y = evt.clientY - rect.top;
  }

  renderer.domElement.addEventListener('mousemove', function (evt) {
    updateMouse(renderer.domElement, evt);
    bufferMaterial.uniforms.mouse.value.x = mouse.x;
    bufferMaterial.uniforms.mouse.value.y = (h - mouse.y);
  });

  function onWindowResize(event) {
    w = window.innerWidth;
    h = window.innerHeight;

    renderer.setSize(w, h);
    finalMaterial.uniforms.resolution.value.x = w;
    finalMaterial.uniforms.resolution.value.y = h;

    textureA.setSize(w, h);
    textureB.setSize(w, h);

    bufferMaterial.uniforms.resolution.value.x = w;
    bufferMaterial.uniforms.resolution.value.y = h;
    bufferMaterial.uniforms.timer.value = 0;
  }
  onWindowResize();
  window.addEventListener('resize', onWindowResize, false);
}

function nStepSimulation() {
  for (var i = 0; i < iterations; i++) {
    renderer.setRenderTarget(textureB);
    renderer.render(bufferScene, camera);

    renderer.setRenderTarget(null);
    renderer.clear();

    var temp = textureA;
    textureA = textureB;
    textureB = temp;

    quad.material.map = textureB.texture;
    bufferMaterial.uniforms.texture.value = textureA.texture;
  }
}

var frameCount = 0;
function render() {
 
  requestAnimationFrame(render);

  if (frameCount % frame == 1) {
    nStepSimulation();
    finalMaterial.uniforms.t.value = Math.sin(frameCount)/100+t;

  };
  ++frameCount;

  ++bufferMaterial.uniforms.timer.value;
  bufferMaterial.uniforms.t.value = roundPos;
  bufferMaterial.uniforms.pixelSize.value = pixelSize;
  bufferMaterial.uniforms.threshold.value = threshold;
  bufferMaterial.uniforms.bound.value = bound;
  bufferMaterial.uniforms.rNeighbour.value = rNeighbour;
  bufferMaterial.uniforms.tNeighbour.value = tNeighbour;
  bufferMaterial.uniforms.travel.value = travel;
  bufferMaterial.uniforms.remember.value = remember;


  finalMaterial.uniforms.color1.value.r = color1.r / 255;
  finalMaterial.uniforms.color1.value.g = color1.g / 255;
  finalMaterial.uniforms.color1.value.b = color1.b / 255;

  finalMaterial.uniforms.color2.value.r = color2.r / 255;
  finalMaterial.uniforms.color2.value.g = color2.g / 255;
  finalMaterial.uniforms.color2.value.b = color2.b / 255;
  finalMaterial.uniforms.activate.value = activate;

  renderer.render(scene, camera);

}


setupMainScene();
setupBufferScene();
initBufferScene();
initFinalScene();
setupEvents();
startText.needsUpdate = true;

addGuiControls();
render();
