const numParticles = 100000;
let currentPos = 0;
let colorPos = 0;
let interval;
let starField
let x = 0.1,
    y = 0.1,
    z = 0.1;
console.log("asdfasdf")
class options{
    constructor(){
        this.a = 1.7; //Dat.gui wouldn't allow anything below .1 :(
        this.b = 1.8; //these get divided by 1,000 in the algorithm
        this.c = 1.9;
        this.d = .4;
        this.e = .5;
        this.f = .5;
    }
}
$(function () {
    opts = new options()
    const gui = new dat.GUI();
    gui.add(opts, 'a').min(0).max(3).step(0.001)
    gui.add(opts, 'b').min(0).max(3).step(0.001)
    gui.add(opts, 'c').min(0).max(3).step(0.001)
    gui.add(opts, 'd').min(0).max(3).step(0.001)
    gui.add(opts, 'e').min(0).max(3).step(0.001)
    gui.add(opts, 'f').min(0).max(3).step(0.001)
    setup();
    // camera.position.z = 100;
    // camera.position.x = -1000

    
    var starsGeometry = new THREE.BufferGeometry();
    starsGeometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(numParticles * 3), 3));
    var starsMaterial = new THREE.PointsMaterial({
        color: 0x2E9AE2,
        opacity:0.5,
        transparent:true
    });
    starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField)

    let up = function () {
        if(currentPos >= numParticles) {
            // clearInterval(interval)
            currentPos = 0;
            colorPos = 0;  
            x = 0.1;
            y = 0.1;
            z = 0.1;
        }
        for (let index = 0; index < numParticles/100; index++) {
            var positions = starField.geometry.attributes.position.array;
            a = opts.a
            b = opts.b
            c = opts.c
            d = opts.d
            e = opts.e
            f = opts.f
            newx = Math.sin(a * z) + c * Math.cos(a * x);
            newy = Math.sin(b * x) + d * Math.cos( b * y);
            newz = Math.sin(e * y) + f * Math.cos( e * z);

            x = newx;
            y = newy;
           z = newz 

            positions[currentPos++] = x * 100;
            positions[currentPos++] = y * 100;
            positions[currentPos++] = z * 100;
    
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