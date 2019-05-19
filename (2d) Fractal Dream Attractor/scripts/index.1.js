const numParticles = 50000  //1000000;
let currentPos = 0;
let colorPos = 0;
let interval;
let starField
let x = -2,
    y = -2,
    z = 0;
let scale = 100
class options {
    constructor() {
        this.a = -1.31;
        this.b = 2.722609509936534 ;
        this.c = 0.8439461727881254;
        this.d = 0.9089758263101316 ;
        this.e = 0.1;
        this.f = 0.005;
    }
}
$(function () {
    opts = new options()
    const gui = new dat.GUI();
    gui.add(opts, 'a').min(-3).max(3).step(0.001)
    gui.add(opts, 'b').min(-3).max(3).step(0.001)
    gui.add(opts, 'c').min(-3).max(3).step(0.001)
    gui.add(opts, 'd').min(-3).max(3).step(0.001)
    gui.add(opts, 'e').min(-3).max(3).step(0.001)
    gui.add(opts, 'f').min(-3).max(3).step(0.001)
    setup();
    var starsGeometry = new THREE.BufferGeometry();
    starsGeometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(numParticles * 3), 3));
    starsGeometry.addAttribute('color', new THREE.BufferAttribute(new Float32Array(numParticles * 3), 3));

    var starsMaterial = new THREE.PointsMaterial({
        vertexColors: THREE.VertexColors,
        // color:new THREE.Color("rgb(0, 255, 255)")
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
            x = -2;
            y = -2;
            z = 0;
        }
        for (let index = 0; index < numParticles / 100; index++) {
            xnew = Math.sin(opts.b * y) +opts.c * Math.sin(opts.b * x)
            ynew = Math.sin(opts.a * x) + opts.d * Math.sin(opts.a * y)
            znew = Math.cos(x * y)
            x = xnew
            y = ynew
            z = znew
            positions[currentPos++] = xnew * 200; //- $("#canvas").innerWidth()/2;
            positions[currentPos++] = ynew * 200;
            positions[currentPos++] = znew * 200;
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
            $("#fps").text("fps: " + Math.round(fps * 10) + " at 100 intervals ")
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

    }
    loop();
    interval = setInterval(function () {
        up();
    }, 0)

    $("#canvas").append(renderer.domElement);
});