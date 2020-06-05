let cnvs,video;

function generateText(text){

    var ctx = cnvs.getContext( '2d' );
    lineheight = 100;
    lines = text.split('-');
    ctx.fillStyle = 'black';
    ctx.fillRect( 0, 0, 1024, 512 );
    ctx.font = '100 100px Courier';
    ctx.fillStyle = 'yellow';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    var x = 1024/(lines.length + 1)
    var y =  512/(lines.length + 1)
    for (var i = 0; i<lines.length; i++)
        ctx.fillText(lines[i], x, y + (i*lineheight) );

}
class TextureFactory {
    constructor() {
        this.texture = null;
    }

    fromCanvas(text = 'welcome'){
        cnvs = document.createElement( 'canvas' );
        cnvs.width = 1024;
        cnvs.height = 512;
        generateText(text);
        this.texture = new THREE.Texture( cnvs );
        this.texture.needsUpdate= true;
    }
    updateCanvas(text=""){
        generateText(text);
        this.texture.needsUpdate = true;
    }

    async fromVideoCapture() {
        video = document.createElement('video');
        video.autoplay="";
        video.style="display:none";
        video.id="feedCam";

    if ( navigator.mediaDevices && navigator.mediaDevices.getUserMedia && video) {
        var constraints = { video: { width: 1280, height: 720, facingMode: 'user' } };


        navigator.mediaDevices.getUserMedia( constraints ).then( function ( stream ) {

            console.log("video",video);
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


    updateWebcam(bufferMaterial, finalMaterial){
        switch (window.activate){
        case 0:
            createTexture.fromVideoCapture().then(()=>{
                window.activate = 1;
                this.updateWebcam(bufferMaterial, finalMaterial);
            });

            break;
        case 1:
            if (this.texture){
                bufferMaterial.uniforms.start.value = this.texture;
                finalMaterial.uniforms.start.value = this.texture;
                window.activate = 2.;
            }
            break;
        case 2:

            const stream = video.srcObject;
            const tracks = stream.getTracks();

            tracks.forEach(function(track) {
                track.stop();
            });

            video.srcObject = null;

            createTexture.fromCanvas("");
            bufferMaterial.uniforms.start.value = this.texture;
            finalMaterial.uniforms.start.value = this.texture;
             window.activate = 0.;
            break;

        default:
            bufferMaterial.uniforms.start.value = this.texture;
            finalMaterial.uniforms.start.value = this.texture;
            window.activate = 0.;

        }
    }
}
