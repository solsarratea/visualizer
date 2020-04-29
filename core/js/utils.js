
function setStartTex(){
    ctx.fillStyle = 'black';
    ctx.fillRect( 0, 0, 1024, 512 );
    ctx.font = '800 400px Courier';
    ctx.fillStyle = 'yellow';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText( 'SOL', 1024 / 5, 512 / 4 );
    ctx.fillText( 'QUEMAL', 1024 / 2, 512 / 2 );
    ctx.fillText( 'SOL', 1024 / 2, 3 * 512 / 4 );
  }
  
  function initStartTex(){
    var cnvs = document.createElement( 'canvas' );
    cnvs.width = 1024;
    cnvs.height = 512;
    ctx = cnvs.getContext( '2d' );
    setStartTex();
    startText = new THREE.Texture( cnvs );
  }
  