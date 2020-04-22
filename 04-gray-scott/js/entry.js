function Brush(){
    this.x = window.innerWidth;
    this.y = window.innerHeight;
    this.enable = 0;
    
    this.isDown = false;

    var vx = 0;
    var vy = 0;
    var mx = 0;
    var my = 0;
    var mouseIsDown = false;
    
    this.swap = function(){
        this.enable = !this.enable;
        console.log(this.enable)
    }

    this.update = function(){
        if (!mouseIsDown) {
            vx += (Math.random() * 2 - 1) * 1.0;
            vy += (Math.random() * 2 - 1) * 1.0;

            vx *= 0.99;
            vy *= 0.99;

            mx += vx;
            my += vy;

            if (mx > window.innerWidth) mx = 0;
            if (mx < 0) mx = window.innerWidth;

            if (my > window.innerHeight) my = 0;
            if (my < 0) my = window.innerHeight;
        }

        this.isDown = 1;
        if (mouseIsDown) this.isDown = 1;
        else this.isDown = 0;

        this.x = mx;
        this.y = my;
    }

    window.addEventListener('mousedown', function() {
        mouseIsDown = true;
        vx = 0;
        vy = 0;
        mx = event.clientX;
        my = window.innerHeight - event.clientY;
    });

    window.addEventListener('mouseup', function() {
        mouseIsDown = false;
    });

    window.addEventListener('mousemove', function() {
        if (mouseIsDown)
        {
            mx = event.clientX;
            my = window.innerHeight - event.clientY;
        }
        
    })
}//
  
if ( navigator.mediaDevices && navigator.mediaDevices.getUserMedia ) {

  var constraints = { video: { width: 1280, height: 720, facingMode: 'user' } };

  navigator.mediaDevices.getUserMedia( constraints ).then( function ( stream ) {

    // apply the stream to the video element used in the texture

    video.srcObject = stream;
    video.play();

  } ).catch( function ( error ) {

    console.error( 'Unable to access the camera/webcam.', error );

  } );

} else {
  console.error( 'MediaDevices interface not available.' );
}

var scene, camera, renderer, width,height,controls,dragControls;
var video, videoTexture, movieScreen;   
function setupMainScene()
{
  scene = new THREE.Scene();
  var width = window.innerWidth;
  var height = window.innerHeight;
  camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );
  camera.position.z = 2;
  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

      ///////////
    // VIDEO //
    //////////

  video = document.getElementById( 'video' );
  videoTexture = new THREE.VideoTexture( video );
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;
  
  movieMaterial = new THREE.MeshBasicMaterial( { map: videoTexture, overdraw: true, side:THREE.DoubleSide } );
  // the geometry on which the movie will be displayed;
  // 		movie image will be scaled to fit these dimensions.
  movieGeometry = new THREE.PlaneGeometry( 240, 100, 4, 4 );
  movieScreen = new THREE.Mesh( movieGeometry, movieMaterial );
  movieScreen.position.set(0,50,0);
  //scene.add(movieScreen);
  
  camera.position.set(0,150,300);
  camera.lookAt(movieScreen.position);
}
  
  
window.dA = .2;
window.dB = 0.2;
window.feed = 0.031;
window.kill = 0.057;
window.brushSize = 1;
window.clear = 0;
window.iterations = 1;
window.flow = 1.00;
window.timeStep = 0.01;
window.brush = new Brush();
window.zoom = 0.;
window.rotate = 0.;
window.centerX = window.innerWidth/2.;
window.centerY = window.innerHeight/2.;
window.interpolate = 0;
window.tNeighbour = 0.;
window.rNeighbour  = 1.;
  
  
var bufferScene, textureA,textureB, initText;
function setupBufferScene() {

  bufferScene = new THREE.Scene();

  textureA = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, { 
  minFilter: THREE.LinearFilter, 
  magFilter: THREE.LinearMipMapLinearFilter, 
  format: THREE.RGBAFormat,
  type: THREE.FloatType});

  textureB = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, { 
  minFilter: THREE.LinearFilter, 
  magFilter: THREE.LinearMipMapLinearFilter, 
  format: THREE.RGBAFormat,
  type: THREE.FloatType} );

  initText = videoTexture;
}
  
var plane, bufferObject;
function initBufferScene(){ 
    bufferMaterial = new THREE.ShaderMaterial( {
    uniforms: {
        bufferTexture: { type: "t", value: textureA.texture },
        start: { type: "t", value: initText },
        res : {type: 'v2',value:new THREE.Vector2(window.innerWidth ,window.innerHeight)},
        brush: {type:'v3',value:new THREE.Vector3(0,0,0)},
        time: {type:'f', value:0.0},
        dA: {type:'f', value:dA},
        dB: {type:'f', value:dB},
        feed: {type:'f', value:feed},
        k: {type:'f', value:kill},
        brushSize: {type:'f', value:brushSize},
        clear: {type:'i', value:clear},
        enableBrush: {type:'i', value: 0},
        flow: {type:'f', value:flow},
        diff1:  {type:'f', value: 0.2*flow},
        diff2:  {type:'f', value: 0.05*flow},
        zoom:  {type:'f', value: zoom},
        rotate:  {type:'f', value: rotate},
        centerX:  {type:'f', value: centerX},
        centerY:  {type:'f', value: centerY},
        t:  {type:'f', value: interpolate},
        tNeighbour:  {type:'f', value: tNeighbour},
        rNeighbour:  {type:'f', value: rNeighbour},
        

    },
        fragmentShader: document.getElementById( 'fragShader' ).innerHTML
    } );

    plane = new THREE.PlaneBufferGeometry( window.innerWidth, window.innerHeight);
    bufferObject = new THREE.Mesh( plane, bufferMaterial );
    bufferScene.add(bufferObject);
}
  
  
window.color1 = new THREE.Color(255, 255, 0);
window.color2 = new THREE.Color(255, 0, 0);
window.color3 = new THREE.Color(0, 204, 255);
  
var finalMaterial, geom, quad;
function initFinalScene(){
  finalMaterial = new THREE.ShaderMaterial( {
    uniforms : {
      video: { type : 't', value : initText, minFilter : THREE.NearestFilter },
      resolution : { type : 'v2', value : new THREE.Vector2( window.innerWidth, window.innerHeight) },
      texture : { type : 't', value : textureB.texture, minFilter : THREE.NearestFilter },
      color1 : { type : 'c', value : color1 },
      color2 : { type : 'c', value : color2 },
      color3 : { type : 'c', value : color3 }
  },
    fragmentShader : document.getElementById( 'color' ).textContent
  } );

  geom = new THREE.PlaneBufferGeometry( window.innerWidth, window.innerHeight);
  quad = new THREE.Mesh( geom, finalMaterial );
  scene.add(quad);   
}

setupMainScene();
setupBufferScene();
initBufferScene();
initFinalScene();

window.loadScreen = () => { clear = 1; }
window.Brushable = () => { brush.swap(); }

function addGuiControls(){
  var gui = new dat.GUI({load: guiData });
      gui.remember(this);
      
      gui.addColor(this, "color1");
      gui.addColor(this, "color2");
      gui.addColor(this, "color3");
      gui.add(this, "interpolate",0.,0.2).step(0.0001);
      gui.add(this, "dA", 0.0, 1.0).step(0.001);
      gui.add(this, "dB", 0.0, 1.0).step(0.001);
      gui.add(this, "feed", 0.0, 0.15).step(0.0001);
      gui.add(this, "kill", 0.0, 0.15).step(0.0001);
      gui.add(this, "timeStep", 0.0, 0.1).step(0.0001);
      gui.add(this, "iterations", 0, 100).step(1);
      gui.add(this, "zoom", -0.1, 0.1).step(0.000001);
      gui.add(this, "rotate", -0.1, 0.1).step(0.000001);
      gui.add(this, "centerX",0,window.innerWidth);
      gui.add(this, "centerY",0,window.innerHeight);
      gui.add(this, "Brushable");
      gui.add(this, "brushSize", 1, 200);
      gui.add(this, "rNeighbour", 0.0, 10.0).step(0.1);
      gui.add(this, "tNeighbour", -rNeighbour, rNeighbour).step(0.5);
}
addGuiControls();
  
function nStepSimulation(){
    for (var i=0; i<iterations; i++){
        //Draw to textureB
        renderer.setRenderTarget(textureB);
        renderer.render(bufferScene, camera);
    
        renderer.setRenderTarget(null);
        renderer.clear();
            
    
        //Swap textureA and B
        var temp = textureA;
        textureA = textureB;
        textureB = temp;
    
        quad.material.map = textureB.texture;
        bufferMaterial.uniforms.bufferTexture.value = textureA.texture;
    }
}
  
var currentTime = bufferMaterial.uniforms.time.value;
function render() {
    requestAnimationFrame( render );

    brush.update();
    bufferMaterial.uniforms.brush.value.x = brush.x;
    bufferMaterial.uniforms.brush.value.y = brush.y;
    bufferMaterial.uniforms.brush.value.z = brush.isDown;

    nStepSimulation(); 

    bufferMaterial.uniforms.time.value += timeStep;
    bufferMaterial.uniforms.zoom.value = zoom;
    bufferMaterial.uniforms.dA.value = dA;
    bufferMaterial.uniforms.dB.value = dB;
    bufferMaterial.uniforms.feed.value = feed;
    bufferMaterial.uniforms.k.value = kill;
    bufferMaterial.uniforms.brushSize.value = brushSize;
    bufferMaterial.uniforms.clear.value = clear;
    bufferMaterial.uniforms.enableBrush.value = brush.enable;
    bufferMaterial.uniforms.flow.value = flow;
    bufferMaterial.uniforms.rotate.value = rotate;
    bufferMaterial.uniforms.centerX.value = centerX;
    bufferMaterial.uniforms.centerY.value = centerY;
    bufferMaterial.uniforms.t.value = interpolate;
    bufferMaterial.uniforms.rNeighbour.value = rNeighbour;
    bufferMaterial.uniforms.tNeighbour.value = tNeighbour;

    finalMaterial.uniforms.color1.value.r = color1.r/255;
    finalMaterial.uniforms.color1.value.g = color1.g/255;
    finalMaterial.uniforms.color1.value.b = color1.b/255;

    finalMaterial.uniforms.color2.value.r = color2.r/255;
    finalMaterial.uniforms.color2.value.g = color2.g/255;
    finalMaterial.uniforms.color2.value.b = color2.b/255;

    finalMaterial.uniforms.color3.value.r = color3.r/255;
    finalMaterial.uniforms.color3.value.g = color3.g/255;
    finalMaterial.uniforms.color3.value.b = color3.b/255;


  renderer.render( scene, camera );
}

render();