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

var bufferScene, textureA, textureB, textureC, startText;
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

  textureC = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearMipMapLinearFilter,
    format: THREE.RGBAFormat,
    type: THREE.FloatType
  });

  textureA.texture.wrapS = THREE.ClampToEdgeWrapping;
  textureA.texture.wrapT = THREE.ClampToEdgeWrapping;
  textureB.texture.wrapS = THREE.ClampToEdgeWrapping;
  textureB.texture.wrapT = THREE.ClampToEdgeWrapping;
  textureC.texture.wrapS = THREE.ClampToEdgeWrapping;
  textureC.texture.wrapT = THREE.ClampToEdgeWrapping;

  createTexture = new TextureFactory();
  createTexture.fromCanvas("");
  startText = createTexture.texture;


}

var plane, bufferObject;
function initBufferScene() {

  bufferMaterial = new THREE.ShaderMaterial({
    uniforms: {
        start: { type: "t", value: startText, minFilter: THREE.NearestFilter },
        texture: { type: 't', value: textureA.texture, minFilter: THREE.NearestFilter },
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
      inter: { type: 'f', value: int },
      outterRadius: { type: 'f', value: outterRadius },
      innerRadius: { type: 'f', value: innerRadius },
      zoom: { type: 'f', value: zoom },
      rotate: { type: 'f', value: rotate },
      centerX: { type: 'f', value: centerX },
      centerY: { type: 'f', value: centerY },
      curves: { type: 'f', value: 0. },
      randomBug: { type: 'f', value: randomBug }

    },

    vertexShader: this.document.getElementById('2d-vertex-shader').innerHTML,
    fragmentShader: this.document.getElementById('2d-fragment-shader').innerHTML
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
window.t = 0;
window.outterRadius = 30.;
window.innerRadius = 10.;
window.int = 0.2;
window.zoom = 0.;
window.rotate = 0.;
window.centerX = window.innerWidth / 2.;
window.centerY = window.innerHeight / 2.;
window.curves = 0.;
window.randomBug = 1.;
window.message = "";



var finalMaterial, geom, quad;
function initFinalScene() {
  finalMaterial = new THREE.ShaderMaterial({
    uniforms: {
      resolution: { type: 'v2', value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      texture: { type: 't', value: textureB.texture, minFilter: THREE.NearestFilter },
        start: { type: "t", value: startText.texture, minFilter: THREE.NearestFilter },
      color1: { type: 'c', value: color1 },
      color2: { type: 'c', value: color2 },
      activate: { type: 'f', value: activate },
      t: { type: 'f', value: 0. },
      zoom: { type: 'f', value: zoom },
      rotate: { type: 'f', value: rotate },
      centerX: { type: 'f', value: centerX },
      centerY: { type: 'f', value: centerY }
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
        "tNeighbour": 0.04,
          "curves" :12.,
      }
    }
  },
  "preset": "default",
  "closed": false,
  "folders": {}
}

window.feedCam = () => {
    createTexture.updateWebcam(bufferMaterial,finalMaterial);
}

window.writeText = () => {
    createTexture.fromCanvas("ready!");

    bufferMaterial.uniforms.start.value = createTexture.texture;
    finalMaterial.uniforms.start.value = createTexture.texture;


}

window.showCurves = () => {
if (window.curves){
        window.curves = 0;
    }else{
        window.curves = 1.;
    }
}

function addGuiControls() {
  var gui = new dat.GUI({ load: guiData });
  gui.remember(this);
  continous = gui.addFolder("Continous")
    // discrite = gui.addFolder("Discrete")

  gui.addColor(this, "color1");
  gui.addColor(this, "color2");
  gui.add(this, "frame", 1., 10.).step(1);
  gui.add(this, "pixelSize", 0.1, 100).step(1.);
  gui.add(this, "zoom", -0.1, 0.1).step(0.000001);
  gui.add(this, "rotate", -0.1, 0.1).step(0.000001);
  gui.add(this, "centerX", 0, window.innerWidth);
  gui.add(this, "centerY", 0, window.innerHeight);

  continous.add(this, "iterations", 0, 100).step(1);
  continous.add(this, "roundPos", -0.2, 1.).step(0.0001);
  continous.add(this, "threshold", 0.01, 2.).step(0.001);

  continous.add(this, "rNeighbour", 0., 2.).step(0.01);
  continous.add(this, "tNeighbour", -1., 1.).step(0.001);
  continous.add(this, "feedCam");
  continous.add(this, "showCurves");
  continous.add(this, "writeText");

  continous.add(this, "randomBug", 1., 24.);
  continous.add(this, "innerRadius", 1., 200.).step(1.);
  continous.add(this, "outterRadius", 3., 500).step(1.);

  continous.add(this, "t", 0., 1.).step(0.01);
  continous.add(this, "int", 0., 1.).step(0.01);
  continous.add(this, 'message');
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

function updateMessage(){
    createTexture.updateCanvas(lastMessage);
    lastMessage = window.message;

}

window.lastMessage = "";
var frameCount = 0,id;
function render() {

    id = requestAnimationFrame(render);

  if (frameCount % frame == 1) {
    nStepSimulation();
      finalMaterial.uniforms.t.value = Math.sin(frameCount) / 100 + t;

  };
    ++frameCount;

    if (lastMessage != message){
        updateMessage();
    }

  ++bufferMaterial.uniforms.timer.value;
  bufferMaterial.uniforms.t.value = t;
  bufferMaterial.uniforms.pixelSize.value = pixelSize;
  bufferMaterial.uniforms.threshold.value = threshold;
  bufferMaterial.uniforms.bound.value = bound;
  bufferMaterial.uniforms.rNeighbour.value = rNeighbour;
  bufferMaterial.uniforms.tNeighbour.value = tNeighbour;
  bufferMaterial.uniforms.inter.value = int;
  bufferMaterial.uniforms.outterRadius.value = outterRadius;
  bufferMaterial.uniforms.innerRadius.value = innerRadius;
  bufferMaterial.uniforms.randomBug.value = randomBug;
  bufferMaterial.uniforms.curves.value = curves;


  bufferMaterial.uniforms.zoom.value = zoom;
  bufferMaterial.uniforms.rotate.value = rotate;
  bufferMaterial.uniforms.centerX.value = centerX;
  bufferMaterial.uniforms.centerY.value = centerY;


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
