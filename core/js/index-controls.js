var modal = document.getElementById("showInfo");
var btn = document.getElementById("btn");
var span = document.getElementsByClassName("close")[0];
var screenshot =  document.getElementById("screenshot");

window.isPlay = false;
modal.style.display = "none";

btn.onclick = function() {
  modal.style.display = "block"
}

span.onclick = function() {
  modal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


screenshot.onclick = function(event){
    var aCanvas = document.getElementById("glCanvas"),
        ctx =  aCanvas.getContext("webgl2", {preserveDrawingBuffer: true});
    ;
    aCanvas.toBlob( function(blob)
                    {
                        var d = new Date();
                        var fName = d.getFullYear()+"_"+d.getMonth()+"_"+d.getDate()+"_"+
                            d.getHours()+"_"+d.getMinutes()+"_"+d.getSeconds();

                        saveAs(blob, "bu3npattern"+fName+".png");
                    });

};