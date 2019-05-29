const numParticles = 100000  //1000000;
let currentPos = 0;
let colorPos = 0;
let interval;
let starField
let x = -2,
    y = -2,
    z = 0;
class options {
    constructor() {
        this.a = 1.17;
        this.b = 2.7640000000000002 ;
        this.c = 1.073;
        this.d = 1.561 ;
    }
}
$(function () {
    opts = new options()
    const gui = new dat.GUI();
    gui.add(opts, 'a').min(0).max(3).step(0.001)
    gui.add(opts, 'b').min(0).max(3).step(0.001)
    gui.add(opts, 'c').min(0).max(3).step(0.001)
    gui.add(opts, 'd').min(0).max(3).step(0.001)
    setup();
    camera.position.z = 400

    var starsGeometry = new THREE.BufferGeometry();
    starsGeometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(numParticles * 3), 3));

    var starsMaterial = new THREE.PointsMaterial({
        color: 0xFFFF00,
        transparent:true,
        opacity:0.4
    });
    starField = new THREE.Points(starsGeometry, starsMaterial);

  
    scene.add(starField)
    var positions = starField.geometry.attributes.position.array;

    let up = function () {

        if (currentPos >= numParticles) {
            currentPos = 0;
            colorPos = 0;
            x = -2;
            y = -2;
            z = 0;
        }
        for (let index = 0; index < numParticles / 100; index++) {
            xnew = Math.sin(opts.b * y) +opts.c * Math.sin(opts.b * x)
            ynew = Math.sin(opts.a * x) + opts.d * Math.sin(opts.a * y)
            x = xnew
            y = ynew
            positions[currentPos++] = xnew * 50; //- $("#canvas").innerWidth()/2;
            positions[currentPos++] = ynew  * 50;
            positions[currentPos++] = 0
        }
        starField.geometry.attributes.position.needsUpdate = true;

        controls.update();
        renderer.render(scene, camera);
    }
    var prev;
    const loop = (now) => {
        controls.update();
        renderer.render(scene, camera);
        camera.lookAt(scene.position);
        composer.render();
        rafId = requestAnimationFrame(loop);

        if (rafId % 10 == 0) {
            var delta = now - prev;
            var fps = 1000 / delta;
            prev = now;
            $("#fps").text("fps: " + Math.round(fps * 10) + " at 100 intervals ")
        }

    }
    loop();
    interval = setInterval(function () {
        up();
    }, 0)

    $("#canvas").append(renderer.domElement);
});