
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
    movieGeometry = new THREE.PlaneGeometry( 240, 100, 4, 4 );
    movieScreen = new THREE.Mesh( movieGeometry, movieMaterial );
    movieScreen.position.set(0,50,0);
    camera.position.set(0,150,300);
    camera.lookAt(movieScreen.position);
  }
    
  var bufferScene, textureA,textureB, videoText;
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
  
    videoText = videoTexture;
  }
  
    
  var plane, bufferObject;
  function initBufferScene(){ 
  
    //videoText = new THREE.TextureLoader().load('/core/zebra2.jpeg' );
      bufferMaterial = new THREE.ShaderMaterial( {
      uniforms: {
        timer : { type : 'i', value: 0}, 
        resolution : {  type : 'v2', value : new THREE.Vector2()}, 
        mouse : { type : 'v2', value : new THREE.Vector2()},
        color1 : { type : 'v3', value : color1}, 
        color2 : { type : 'v3', value : color2},
        texture : { type : 't', value : textureA.texture}, 
        dA : { type: 'f', value :   dA}, 
        dB : { type: 'f', value :   dB}, 
        kill : { type: 'f', value :   kill}, 
        feed : { type: 'f', value :   feed}, 
        dT : { type: 'f', value :   dT},
        start: { type: "t", value: videoText },
        t:  {type:'f', value: interpolate},
        pixelSize:  {type:'f', value: pixelSize},

      },
          
      vertexShader : document.getElementById('vertexShader').innerHTML,
      fragmentShader : this.document.getElementById('fragShader').innerHTML
      } );
  
      plane = new THREE.PlaneBufferGeometry( window.innerWidth, window.innerHeight);
      bufferObject = new THREE.Mesh( plane, bufferMaterial );
      bufferScene.add(bufferObject);
  
      startText.needsUpdate = true;
  }
    
    
  window.color1 = new THREE.Color(255, 255, 255);
  window.color2 = new THREE.Color(0, 0, 0);
  window.timer = 0;
  window.mouse = {x : 0, y : 0};
    
  window.dA = .2;
  window.dB = 0.2;
  window.feed = 0.031;
  window.kill = 0.057;
  
  window.clear = 0;
  window.iterations = 1;
  window.interpolate = 0;
  window.dT = 0.01;
  window.pixelSize = 10.;
    
    
  var finalMaterial, geom, quad;
  function initFinalScene(){
    finalMaterial = new THREE.ShaderMaterial( {
      uniforms : {
        resolution : { type : 'v2', value : new THREE.Vector2( window.innerWidth, window.innerHeight) },
        texture : { type : 't', value : textureB.texture, minFilter : THREE.NearestFilter },
        color1 : { type : 'c', value : color1 },
        color2 : { type : 'c', value : color2 }
      },
      vertexShader : document.getElementById('vertexShader').innerHTML, 
      fragmentShader : document.getElementById( 'color' ).textContent
    } );
  
    geom = new THREE.PlaneBufferGeometry( window.innerWidth, window.innerHeight);
    quad = new THREE.Mesh( geom, finalMaterial );
    scene.add(quad);   
  }
  
  window.guiData= {
    "color1": {
      "r": 255,
      "g": 255,
      "b": 255
    },
    "color2": {
      "r": 0,
      "g": 47.00000000000006,
      "b": 255
    },
    "dA": 0.778,
    "dB": 0.421,
    "dT": 0.003,
    "feed": 0.0078000000000000005,
    "kill": 0.051000000000000004,
    "iterations": 1, 
    "interpolate": 0.3,
    "pixelSize": 10.,
   
  };
  
  function addGuiControls(){
    var gui = new dat.GUI({load: guiData });
        gui.remember(this);
        
        gui.addColor(this, "color1");
        gui.addColor(this, "color2");
   /*      gui.add(this, "dA", 0.0, 1.0).step(0.001);
        gui.add(this, "dB", 0.0, 1.0).step(0.001);
        gui.add(this, "feed", 0.0, 0.15).step(0.0001);
        gui.add(this, "kill", 0.0, 0.15).step(0.0001);
        gui.add(this, "dT", 0.0, 0.1).step(0.0001); */
        gui.add(this, "iterations", 0, 100).step(1);
        gui.add(this, "interpolate",0.,6.).step(0.0001);
        gui.add(this, "pixelSize",0.1,100).step(1.);
        
  }
  
  
  function setupEvents(){
    function updateMouse( canvas, evt ) {
        var rect = canvas.getBoundingClientRect();
        mouse.x = evt.clientX - rect.left;
        mouse.y = evt.clientY - rect.top;
    }
  
    renderer.domElement.addEventListener( 'mousemove', function( evt ) {
        updateMouse( renderer.domElement, evt );
          bufferMaterial.uniforms.mouse.value.x = mouse.x;
          bufferMaterial.uniforms.mouse.value.y = (h - mouse.y);
    } );
  
    function onWindowResize( event ) {
        w = window.innerWidth;
        h = window.innerHeight;
  
        renderer.setSize( w, h );
        finalMaterial.uniforms.resolution.value.x = w;
        finalMaterial.uniforms.resolution.value.y = h;
  
        textureA.setSize( w, h );
        textureB.setSize( w, h );
  
        bufferMaterial.uniforms.resolution.value.x = w;
        bufferMaterial.uniforms.resolution.value.y = h;
        bufferMaterial.uniforms.timer.value = 0;
        bufferMaterial.uniforms.texture.value = videoText;
    }
    onWindowResize();
    window.addEventListener( 'resize', onWindowResize, false );
  } 
    
  function nStepSimulation(){
      for (var i=0; i<iterations; i++){
          renderer.setRenderTarget(textureB);
          renderer.render(bufferScene, camera);
      
          renderer.setRenderTarget(null);
          renderer.clear();
      
          var temp = textureA;
          textureA = textureB;
          textureB = temp;
      
          bufferMaterial.uniforms.texture.value = textureA.texture;
      }
  }
    
var frame = 0;
  function render() {
  
    requestAnimationFrame( render );

    if (frame % 5 == 1){
      nStepSimulation(); 

    };
    ++ frame;
  
      ++ bufferMaterial.uniforms.timer.value;
      bufferMaterial.uniforms.dA.value = dA;
      bufferMaterial.uniforms.dB.value = dB;
      bufferMaterial.uniforms.feed.value = feed;
      bufferMaterial.uniforms.kill.value = kill;
      bufferMaterial.uniforms.t.value = interpolate;
      bufferMaterial.uniforms.pixelSize.value = pixelSize;
      
      finalMaterial.uniforms.color1.value.r = color1.r/255;
      finalMaterial.uniforms.color1.value.g = color1.g/255;
      finalMaterial.uniforms.color1.value.b = color1.b/255;
      
      finalMaterial.uniforms.color2.value.r = color2.r/255;
      finalMaterial.uniforms.color2.value.g = color2.g/255;
      finalMaterial.uniforms.color2.value.b = color2.b/255;
      renderer.render( bufferScene, camera );
  
  }
  
  
  
  window.startText;
  initStartTex();
  
  setupMainScene();
  setupBufferScene();
  initBufferScene();
  initFinalScene();
  setupEvents();
  addGuiControls();
  render();