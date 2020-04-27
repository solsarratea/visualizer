var w = window.innerWidth;
var h = window.innerHeight;

window.guiData = {
    "preset": "fuego",
    "remembered": {
      "default": {
        "0": {
          "colorA": {
            "r": 219.29999999999998,
            "g": 203.54235099337748,
            "b": 70.5871875
          },
          "colorB": {
            "r": 224.4,
            "g": 155.31301796407186,
            "b": 18.372750000000007
          },
          "sizeBrush": 57,
          "amountBrush": 0.705,
          "radius": 1.62,
          "diff1": 0.858,
          "diff2": 1.599,
          "weight": 0.21,
          "mixColor": 0.17
        }
      },
      "fuego": {
        "0": {
          "sizeBrush": 57,
          "amountBrush": 0.705,
          "colorA": {
            "r": 219.29999999999998,
            "g": 203.54235099337748,
            "b": 70.5871875
          },
          "colorB": {
            "r": 224.4,
            "g": 155.31301796407186,
            "b": 18.372750000000007
          },
          "mixColor": 0.17,
          "radius": 1.62,
          "diff1": 0.858,
          "diff2": 1.599,
          "weight": 0.21
        }
      }
    },
    "closed": false,
    "folders": {
      "Colorize": {
        "preset": "Default",
        "closed": false,
        "folders": {}
      },
      "Diffusion": {
        "preset": "Default",
        "closed": false,
        "folders": {}
      }
    }
  }
 
window.colorA= new THREE.Color(89,177,111);
window.colorB= new THREE.Color(192,51,96);
window.sizeBrush = 46.;
window.amountBrush = 0.25;
window.radius = 1.;
window.diff1 = 1;
window.diff2 = 0.94;
window.weight = 1.16;
window.mixColor = 0.5;

var colorF, diffusionF;
function addGuiControls(){
    window.gui = new dat.GUI({ load: guiData });
    colorF = gui.addFolder("Colorize")
    diffusionF = gui.addFolder("Diffusion")
    gui.remember(this);
    gui.add(this, "sizeBrush",10.,100.).step(1.);
    gui.add(this, "amountBrush",0.01,1.).step(.001); 
    colorF.addColor(this,"colorA");
    colorF.addColor(this,"colorB");
    colorF.add(this, "mixColor",0,1).step(0.01);  
    diffusionF.add(this, "radius",0.1,10.).step(.01); 
    diffusionF.add(this, "diff1",0.1,2.).step(.001); 
    diffusionF.add(this, "diff2",0.1,2.).step(.001);
    diffusionF.add(this, "weight",0.,2.).step(.01);
}


var camera,renderer,scene;
function setupMainScene(){
    camera = new THREE.Camera();
    renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true } );
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor( 0x665544, 1 );
    document.body.appendChild( renderer.domElement );
    scene = new THREE.Scene();
}



var bufferScene ,ping ,pong, renderTargetParams; 
function setupBufferScene(){
    bufferScene = new THREE.Scene();
    renderTargetParams = {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType
    };
    
    ping = new THREE.WebGLRenderTarget( w, h, renderTargetParams );
    pong = new THREE.WebGLRenderTarget( w, h, renderTargetParams );
    
}

var bufferUniforms, bufferMaterial, plane, bufferObject;
function initBufferScene(){
    bufferUniforms = {
        texture: { type : 't', value : pong.texture },
        resolution : { type : 'v2', value : new THREE.Vector2( w, h ) },
        smokeSource: {type:"v3",value:new THREE.Vector3(0,0,0)},
        sizeBrush: {type:'f', value: 10. },
        colorA : { type : 'c', value : colorA },
        colorB : { type : 'c', value : colorB},
        step: {type:'f', value: 1. },
        diff1: {type:'f', value: 0.8 },
        diff2: {type:'f', value: 1.4 },
        weight: {type:'f', value: 3. },
        t: {type:'f', value: 0.5 },
    };
    
    bufferMaterial = new THREE.ShaderMaterial({
        uniforms : bufferUniforms,
        fragmentShader : document.getElementById( 'fragShader' ).textContent
    });
    
    plane = new THREE.PlaneBufferGeometry( 2, 2 );
    bufferObject = new THREE.Mesh( plane, bufferMaterial );
    bufferScene.add(bufferObject);
}

var finalMaterial,quad;
function initMainScene(){
    finalMaterial =  new THREE.MeshBasicMaterial({map: ping});
    quad = new THREE.Mesh( plane, finalMaterial );
    scene.add(quad);
}

function setSmokeMouse(){
    var mouseDown = false;
    function UpdateMousePosition(X,Y){
        var mouseX = X;
          var mouseY = h - Y;
          bufferMaterial.uniforms.smokeSource.value.x = mouseX;
          bufferMaterial.uniforms.smokeSource.value.y = mouseY;
    }
    document.onmousemove = function(event){
          UpdateMousePosition(event.clientX,event.clientY)
    }
    
    document.onmousedown = function(event){
        mouseDown = true;
        bufferMaterial.uniforms.smokeSource.value.z = amountBrush;
    }
    document.onmouseup = function(event){
        mouseDown = false;
        bufferMaterial.uniforms.smokeSource.value.z = 0;
    }
}
setSmokeMouse();

function render() {
    requestAnimationFrame( render );
    //Draw ping to buffer
    renderer.setRenderTarget(ping);
    renderer.render(bufferScene, camera);

    renderer.setRenderTarget(null);
    renderer.clear();
        
    //Swap ping and pong
    let temp = pong;
    pong = ping;
    ping = temp;

    //Update uniforms
    quad.material.map = ping;
    bufferMaterial.uniforms.texture.value=pong;
    bufferMaterial.uniforms.sizeBrush.value=sizeBrush;

    bufferMaterial.uniforms.colorA.value.r = colorA.r/255;
    bufferMaterial.uniforms.colorA.value.g = colorA.g/255;
    bufferMaterial.uniforms.colorA.value.b = colorA.b/255;

    bufferMaterial.uniforms.colorB.value.r = colorB.r/255;
    bufferMaterial.uniforms.colorB.value.g = colorB.g/255;
    bufferMaterial.uniforms.colorB.value.b = colorB.b/255;

    bufferMaterial.uniforms.step.value = radius;
    bufferMaterial.uniforms.diff1.value = diff1;
    bufferMaterial.uniforms.diff2.value = diff2;
    bufferMaterial.uniforms.weight.value = weight;
    bufferMaterial.uniforms.t.value = mixColor;



    //Draw to screen
    renderer.render( scene, camera );
 }


setupMainScene();
setupBufferScene();
initBufferScene();
initMainScene();
    
addGuiControls();
render();