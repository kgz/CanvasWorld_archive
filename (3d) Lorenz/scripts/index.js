const numParticles = 100000;
let currentPos = 0;
var starField ;
let x = 1,
    y = 1,
    z = 0;
class options {
    constructor() {
        this.a = 10; 
        this.b = 28; 
        this.c = 8/3; 
        this.speed = 1;
    }
}


$(function () {
    opts = new options()
    const gui = new dat.GUI();
    gui.add(opts, 'a').min(0).max(50).step(0.0001)
    gui.add(opts, 'b').min(0).max(50).step(0.0001)
    gui.add(opts, 'c').min(0).max(50).step(0.0001)
    gui.add(opts, 'speed').min(0).max(20).step(.5)
    setup();
    // camera.position.z = -20
    var prev = 0;
     
    var starsGeometry = new THREE.BufferGeometry();
    starsGeometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(numParticles * 3), 3));

    var starsMaterial = new THREE.LineBasicMaterial({
        color: 0x729ee5,
        transparent:true,
        opacity:0.8
    });
    starField = new THREE.Line(starsGeometry, starsMaterial);
    scene.add(starField);
    starField.geometry.setDrawRange(0, currentPos)

    var positions = starField.geometry.attributes.position.array;
    var light = new THREE.AmbientLight( 0x729ee5 , 50); // soft white light
    scene.add( light );
    let up = function (){
        if (currentPos >= numParticles) {
            currentPos = 0;
            colorPos = 0;
            x = 0.1;
            y = 0;
            z = 0;
        }
        for (let i = 0; i < numParticles/ 10; i++) {
            // console.log("sdaf")

            newx = opts.a * (y - x) 
            newy = x * (opts.b - z) - y
            newz = x * y - opts.c * z
            x += newx * 0.002
            y += newy * 0.002
            z += newz * 0.002

            positions[currentPos++] = newx * 0.5;
            positions[currentPos++] = newy * .5;
            positions[currentPos++] = newz * .5;

        }

        starField.geometry.attributes.position.needsUpdate = true;

    }
    var dr = 0;
    const loop = (now) => {
        camera.lookAt(scene.position);
        composer.render();
        rafId = requestAnimationFrame(loop);
        if (rafId % 10 == 0) {
            var delta = now - prev;
            var fps = 1000 / delta;
            prev = now;
            $("#fps").text("fps: " + Math.round(fps * 10))

        }
        // scene.rotation.y += 0.01
        starField.geometry.setDrawRange(0, dr >= numParticles ? dr : dr += 1 * opts.speed)


    }
    loop();
    interval = setInterval(function () {
        up();
    }, 0)
    $("#canvas").append(renderer.domElement);
});