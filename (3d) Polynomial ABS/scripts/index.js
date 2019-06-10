const numParticles = 20000;
let currentPos = 0;
let x = 0,
    y = 0,
    z = 0;
class options {
    constructor() {
        this.x = {
            a: 0.607407407407407,
            b: 1.1322,
            c: 0.47040000000000004,
            d: -0.0148,
            e: -0.3236,
            f: -0.41190000000000004,
            g: -0.1913,
        }
        this.y = {
            a: -0.693,
            b: -0.521,
            c: 0.399,
            d: -0.968,
            e: 0.958,
            f: 0.305,
            g: -0.43
        }
        this.z = {
            a: 0.133,
            b: 0.416,
            c: 1.144,
            d: -0.651851851851852,
            e: -0.844444444444444,
            f: 0.754,
            g: -0.414814814814815,
        }

    }

}
let starfield;
$(function () {

    function gen() {
        scene.children = []
        var starsGeometry = new THREE.BufferGeometry();
        starsGeometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(numParticles * 3), 3));
        starsGeometry.addAttribute('color', new THREE.BufferAttribute(new Float32Array(numParticles * 3), 3));
        var starsMaterial = new THREE.PointsMaterial({
            vertexColors: THREE.VertexColors,
            // color: 0xffa500,
            transparent: true,
            opacity: 1,
            morphTargets: true,
            pointSize: 0.5
        });
        starField = new THREE.Points(starsGeometry, starsMaterial);
        scene.add(starField);
    }
    opts = new options()
    const gui = new dat.GUI();

    for (i of Object.keys(opts)) {
        fx = gui.addFolder(i)
        for (ii of Object.keys(opts[i]))
            fx.add(opts.x, ii).min(-2).max(2).step(0.0001)
    }


    setup();
    camera.position.z = 800

    var prev = 0;
    gen()
    var positions = starField.geometry.attributes.position.array;
    var colors = starField.geometry.attributes.color.array

    let up = function () {
        if (currentPos >= numParticles) {
            currentPos = 0;
            x = 0;
            y = 0;
            z = 0;
        }
        for (let i = 0; i < numParticles; i++) {

            g = (i, ii) => {
                return opts[i][ii] || 0
            }
            xnew = g("x", "a") + g("x", "b") * x + g("x", "c") * y + g("x", "d") * z + g("x", "e") * Math.abs(x) + g("x", "f") * Math.abs(y) + g("x", "g") * Math.abs(z)
            ynew = g("y", "a") + g("y", "b") * x + g("y", "c") * y + g("y", "d") * z + g("y", "e") * Math.abs(x) + g("y", "f") * Math.abs(y) + g("y", "g") * Math.abs(z)
            znew = g("z", "a") + g("z", "b") * x + g("z", "c") * y + g("z", "d") * z + g("z", "e") * Math.abs(x) + g("z", "f") * Math.abs(y) + g("z", "g") * Math.abs(z)

            x = xnew
            y = ynew
            z = znew
            col = Math.abs(map(Math.sin(x + y - z), 0, 1, 200, 360))

            col ? c = new THREE.Color("hsl(" + col + ", 50%, 50%)") : new THREE.Color("hsl(0, 50%, 50%)")
            colors[currentPos] = c.r;
            colors[currentPos + 1] = c.g
            colors[currentPos + 2] = c.b


            positions[currentPos++] = x * 50;
            positions[currentPos++] = y * 50;
            positions[currentPos++] = z * 50;
        }
        hasres = false;

        starField.geometry.attributes.color.needsUpdate = true;
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
    }
    loop();
    interval = setInterval(function () {
        up();
    }, 0)
    $("#canvas").append(renderer.domElement);
});