const numParticles = 100000 //1000000;
let currentPos = 0;
let colorPos = 0;
let interval;
let starField
let x = 0,
    y = -200,
    z = 0;
class options {
    constructor() {
        this.a = 7.4
        this.b = 8
        this.c = 9.1
        this.d = 8


    }
}
$(function () {
    opts = new options()
    const gui = new dat.GUI();
    gui.add(opts, 'a', 0, 20).name("a")
    gui.add(opts, 'b', 0, 20).name("b")
    gui.add(opts, 'c', 0, 20).name("c")
    gui.add(opts, 'd', 0, 20).name("d")

    setup();

    var starsGeometry = new THREE.BufferGeometry();
    starsGeometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(numParticles * 3), 3));
    starsGeometry.addAttribute('color', new THREE.BufferAttribute(new Float32Array(numParticles * 3), 3));

    var starsMaterial = new THREE.PointsMaterial({
        vertexColors: THREE.VertexColors,
        // color:new THREE.Color("rgb(0, 255, 255)"),
        size: 5
    });
    starField = new THREE.Points(starsGeometry, starsMaterial);

    for (let index = 0; index < starField.geometry.attributes.color.array.length; index += 3) {
        const colors = starField.geometry.attributes.color.array

        percent = (index / 255)
        out = percent * 255
        c = new THREE.Color("hsl(" + index % 255 + ", 50%, 50%)")
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
            x = 0;
            y = -200;
            z = 0;
        }
        for (let index = 0; index < numParticles / 100; index++) {
            t = currentPos / 1000
            // let x1 = (2 + Math.cos(2 * t)) * Math.cos(3*t)
            // let y1 = (2 + Math.cos(2 * t)) * Math.sin(3*t)
            // let z1 = Math.sin(t* 4)
            let x1 = (opts.a + Math.cos(opts.b * t)) * Math.cos(opts.c * t)
            let y1 = (opts.a + Math.cos(opts.b * t)) * Math.sin(opts.c * t)
            let z1 = Math.sin(t * opts.d)
            x += x1
            y += y1
            z += z1;
            positions[currentPos++] = x * 0.5 //* 20; //- $("#canvas").innerWidth()/2;
            positions[currentPos++] = (y * 0.5) //* 20;
            positions[currentPos++] = z * 0.5 //* 20;
        }
        starField.geometry.attributes.position.needsUpdate = true;
        starField.geometry.attributes.color.needsUpdate = true;

        controls.update();
        renderer.render(scene, camera);
        if (x == 0 && y == 0 && z == 0) clearInterval(interval)
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
        // scene.rotation.x += 0.02
        // scene.rotation.y += 0.01
    }

    loop();
    interval = setInterval(function () {
        up();
    }, 0)

    $("#canvas").append(renderer.domElement);
});