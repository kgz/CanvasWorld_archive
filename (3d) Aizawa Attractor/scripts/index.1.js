const numParticles = 1000000  //1000000;
let currentPos = 0;
let colorPos = 0;
let interval;
let starField
let x = 0.1,
    y = 0,
    z = 0;
let scale = 100
class options {
    constructor() {
        this.a = 0.92125 * scale; //Dat.gui wouldn't allow anything below .1 :(
        this.b = 0.715 * scale; //these get divided by ${scale} in the algorithm
        this.c = 0.531 * scale;
        this.d = 4.11 * scale;
        this.e = 0.281 * scale;
        this.f = 0.119 * scale
        
    }
}
$(function () {
    opts = new options()
    const gui = new dat.GUI();
    gui.add(opts, 'a', 0, 100).name("a / " + scale)
    gui.add(opts, 'b', 0, 100).name("b / " + scale)
    gui.add(opts, 'c', 0, 100).name("c / " + scale)
    gui.add(opts, 'd', 0, 1000).name("d / "  + scale)
    gui.add(opts, 'e', 0, 100).name("e / "  + scale)
    gui.add(opts, 'f', 0, 100).name("f / "  + scale)
    setup();
    scene.rotation.x = -Math.PI/2

    // scene.position.y  = -1000
    // camera.position.y  = -1000
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
            x = 0.1;
            y = 0;
            z = 0;
        }
        for (let index = 0; index < numParticles / 100; index++) {
            a = opts.a / scale
            b = opts.b / scale
            c = opts.c / scale
            d = opts.d / scale
            e = opts.e / scale
            f = opts.f / scale

            let x1 = (z - b) * x - d * y;
            let y1 = d * x + (z - b) * y;
            let z1 = c + a * z - (Math.pow(z, 3) / 3) - (Math.pow(x, 2) + Math.pow(y, 2)) *	(1 + e * z) + f * z * (Math.pow(x, 3));




            x  = x + 0.01 * x1
            y = y + 0.01 * y1
            z  = z + 0.01 * z1
           
            positions[currentPos++] = x * 200; //- $("#canvas").innerWidth()/2;
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
        scene.rotation.z += 0.01
    }

    loop();
    interval = setInterval(function () {
        up();
    }, 0)

    $("#canvas").append(renderer.domElement);
});