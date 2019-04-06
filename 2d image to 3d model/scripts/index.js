// 2d image to 3d.
//uses the total value of the pixel color to define a z-index.
//works best on sharp colours with black or transparent background, white backgrounds can leave a border.


const numParticles = 100;

$(function () {
    $("<input/>", {
        css: {
            position: "absolute",
            bottom: "0px",
            left: "0px",
            width: "90%"
        },
        name:"URLINPUT",
        value:"http://pictify.saatchigallery.com/files/works/pink-gerbera-daisies-1409848544_org.jpg"
    }).appendTo("#canvas")
    $("<button/>", {
        css: {
            position: "absolute",
            bottom: "0px",
            right: "20px",
        },
        click: function () {
            while (scene.children.length > 0) {
                scene.remove(scene.children[0]);
            }
            go();
        },
        text: "Run"
    }).appendTo("#canvas")
    $("<canvas>", {
        id:"canvasq",
        css:{width:numParticles + "px",
        height: numParticles+"px",
        position:"absolute",
        top:"0px",
        right:"0px",
    }
    }).appendTo("#canvas")
    setup();
    scene.rotateZ(3.14159)

    camera.position.z = -300
    let go = function () {
        var img = new Image();
        img.crossOrigin = "Anonymous";
        //urls that dont have a 'Access-Control-Allow-Origin: *'  header are blocked by the canvas element.
        //thus we need to always ensure that the image comes from one that does so we redirect it via this heroku app.
        //https://github.com/Rob--W/cors-anywhere
        img.src ="https://cors-anywhere.herokuapp.com/"+$("[name='URLINPUT']").val(); 
        var canvas = document.getElementById('canvasq')
        var context = canvas.getContext('2d');
        canvas.width = numParticles
        canvas.height = numParticles
        img.onload = function () {
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
            for (let x = 0; x < numParticles; x++) {
                for (let y = 0; y < numParticles; y++) {
                    imageData = context.getImageData(x, y, 1, 1).data;
                    let ad = imageData[0] + imageData[1] + imageData[2]
                    if( ad > 760 || ad < 1)
                        continue
                    var geometry = new THREE.BoxGeometry(1, 1, Math.floor((imageData[0] +imageData[1] +imageData[2] ) / 3)/10);
                    geometry.translate(x - numParticles / 2, y - numParticles / 2, 0)
                    var material = new THREE.MeshBasicMaterial({
                        color: new THREE.Color("rgb(" + imageData[0] + ", " + imageData[1] + ", " + imageData[2] + ")")
                    });
                    var cube = new THREE.Mesh(geometry, material);
                    scene.add(cube)
                }
            }
        }
    };
    var prev;
    const loop = (now) => {
        camera.lookAt(scene.position);
        composer.render();
        rafId = requestAnimationFrame(loop);
        var delta = now - prev;
        var fps = 1000 / delta;
        prev = now;
        $("#fps").text("fps: " + Math.round(fps))
        scene.rotation.y += 0.01;
    }
    go();
    loop();
    $("#canvas").append(renderer.domElement);
});