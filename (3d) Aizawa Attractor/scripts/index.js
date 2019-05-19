const numParticles = 10000  //1000000;
let currentPos = 0;
let colorPos = 0;
let interval;
let starField
let x = 0.1,
    y = 0,
    z = 0;
class options {
    constructor() {
        this.a = 0.92125; 
        this.b = 0.715; 
        this.c = 0.531;
        this.d = 4.11;
        this.e = 0.281;
        this.f = 0.119
        
    }
}
$(function () {
    opts = new options()
    const gui = new dat.GUI();
    gui.add(opts, 'a').min(0).max(2).step(0.0001)
    gui.add(opts, 'b').min(0).max(2).step(0.0001)
    gui.add(opts, 'c').min(0).max(2).step(0.0001)
    gui.add(opts, 'd').min(0).max(5).step(0.0001)
    gui.add(opts, 'e').min(0).max(2).step(0.0001)
    gui.add(opts, 'f').min(0).max(2).step(0.0001)
    setup();
    scene.rotation.x = -Math.PI/2
    var starsGeometry = new THREE.BufferGeometry();
    starsGeometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(numParticles * 3), 3));
    starsGeometry.addAttribute('color', new THREE.BufferAttribute(new Float32Array(numParticles * 3), 3));
    var starsMaterial = new THREE.PointsMaterial({
        vertexColors: THREE.VertexColors,
    });
    starField = new THREE.Points(starsGeometry, starsMaterial);

    for (let index = 0; index < starField.geometry.attributes.color.array.length; index += 3) {
        const colors = starField.geometry.attributes.color.array
        percent = (index / 255)
        out = percent * 255
        c = new THREE.Color("hsl(" + out % 255 + ", 50%, 50%)")
        colors[index] = c.r;
        colors[index + 1] = c.g
        colors[index + 2] = c.b
    }
    scene.add(starField)
    var positions = starField.geometry.attributes.position.array;
    let up = function () {
        if (currentPos >= numParticles) {
            currentPos = 0;
            colorPos = 0;
            x = 0.1;
            y = 0;
            z = 0;
        }
        for (let index = 0; index < numParticles; index++) {
            a = opts.a
            b = opts.b
            c = opts.c
            d = opts.d
            e = opts.e
            f = opts.f

            let x1 = (z - b) * x - d * y;
            let y1 = d * x + (z - b) * y;
            let z1 = c + a * z - ((z*z*z) / 3) - (x*x + y*y) *	(1 + e * z) + f * z * (x*x*x);
            x  = x + 0.01 * x1
            y = y + 0.01 * y1
            z  = z + 0.01 * z1    
            positions[currentPos++] = x * 200;
            positions[currentPos++] = y * 200;
            positions[currentPos++] = (z * 200) - 200;
        }
        starField.geometry.attributes.position.needsUpdate = true;
        starField.geometry.attributes.color.needsUpdate = true;

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
            $("#fps").text("fps: " + Math.round(fps * 10))
        }
        stars = starField.geometry.attributes.color.array
        first = (stars[stars.length - 3], stars[stars.length - 2], stars[stars.length - 1])
        for (let x = 3; x < starField.geometry.attributes.color.array.length; x = x + 3) {
            stars[x - 3] = stars[x];
            stars[x - 2] = stars[x + 1];
            stars[x - 1] = stars[x + 2];
        }
        stars[0] = first[0]
        stars[1] = first[1]
        stars[2] = first[2]
        scene.rotation.z += 0.01
    }

    loop();
    interval = setInterval(function () {
        up();
    }, 0)

    $("#canvas").append(renderer.domElement);
});