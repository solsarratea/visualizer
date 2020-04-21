var w = window.innerWidth;
var h = window.innerHeight;

window.guiData = {
    "preset": "default",
    "remembered": {
        "default": {
        "0": {
            "colorA": {
            "r": 89.07628676470587,
            "g": 177.5,
            "b": 111.43630620351591
            },
            "colorB": {
            "r": 192.5,
            "g": 51.30974264705883,
            "b": 96.72758766968325
            },
            "sizeBrush": 10.
            }
        }
    }
}

 
window.colorA= new THREE.Color(255, 255, 0);
window.colorB= new THREE.Color(255, 0, 0);
window.sizeBrush = 10.;
function addGuiControls(){
    var gui = new dat.GUI({ load: guiData });
    gui.remember(this);


    gui.addColor(this,"colorA");
    gui.addColor(this,"colorB"); 
    gui.add(this, "sizeBrush",10.,100.).step(1.);  
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
        colorB : { type : 'c', value : colorB}
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
        bufferMaterial.uniforms.smokeSource.value.z = 0.01;
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


    //Draw to screen
    renderer.render( scene, camera );
 }


setupMainScene();
setupBufferScene();
initBufferScene();
initMainScene();
    
addGuiControls();
render();