class TextureFactory {
    constructor() {
        this.texture = null;
      }

    fromCanvas(text = 'welcome'){
        var cnvs = document.createElement( 'canvas' );
        cnvs.width = 1024;
        cnvs.height = 512;
        var ctx = cnvs.getContext( '2d' );
        ctx.fillStyle = 'black';
        ctx.fillRect( 0, 0, 1024, 512 );
        ctx.font = '300 200px Courier';
        ctx.fillStyle = 'yellow';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText( text , 1024 / 2, 512 / 2 );
        
        this.texture = new THREE.Texture( cnvs );
  
        this.texture.needsUpdate= true;
    }

    fromVideoCapture() {
    if ( navigator.mediaDevices && navigator.mediaDevices.getUserMedia ) {
        var constraints = { video: { width: 1280, height: 720, facingMode: 'user' } };
        
        navigator.mediaDevices.getUserMedia( constraints ).then( function ( stream ) {
        video.srcObject = stream;
        video.play();
        
        } ).catch( function ( error ) {
            console.error( 'Unable to access the camera/webcam.', error );
        
        } );
        
    } else {
        console.error( 'MediaDevices interface not available.' );
    }
    window.video = document.getElementById('video');
    this.texture = new THREE.VideoTexture(video);
    this.texture.minFilter = THREE.LinearFilter;
    this.texture.magFilter = THREE.LinearFilter;
    }

    fromImage(path){
        this.texture = new THREE.TextureLoader().load(path);
    }

}

