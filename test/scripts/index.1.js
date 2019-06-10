const numParticles = 100000;
let currentPos = 0;
let x = 1,
    y = 1,
    z = 0;
class options {
    constructor() {
        this.b = 0.15280000000000002; 
    }
}


$(function () {
    opts = new options()
    const gui = new dat.GUI();
    gui.add(opts, 'b').min(0).max(0.3).step(0.0001)
    setup();
    // camera.position.z = -20
    camera.position.x = 35.43249764260721
    camera.position.y = 39.927920064464544
    camera.position.z = 500 //32.83442338378801
    var prev = 0;
     
    var starsGeometry = new THREE.BufferGeometry();
    starsGeometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(numParticles * 3), 3));

    var starsMaterial = new THREE.PointsMaterial({
        color: 0x729ee5,
        transparent:true,
        opacity:0.8
    });
    var starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);
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

            newx = -opts.b * x + Math.sin(y) //Math.sin(y) - (opts.b * x)
            newy = -opts.b * y + Math.sin(z)//Math.sin(z) - (opts.b * y)
            newz = -opts.b * z + Math.sin(x)//Math.sin(x) - (opts.b * z)
            x += newx
            y += newy
            z += newz

            positions[currentPos++] = newx * 100;
            positions[currentPos++] = newy * 100;
            positions[currentPos++] = newz * 100;

    
        }
        starField.geometry.attributes.position.needsUpdate = true;

    }
    
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
    }
    loop();
    interval = setInterval(function () {
        up();
    }, 0)
    $("#canvas").append(renderer.domElement);
});