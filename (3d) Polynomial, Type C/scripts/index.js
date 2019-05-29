const numParticles = 20000;
let currentPos = 0;
let x = 0,
    y = 0,
    z = 0;
class options {
    constructor() {
        this.x = {
                a: -0.653165,
                b: -0.972152,
                c: -0.713924,
                d: -0.481,
                e: 0.516456,
                f: -0.592405
            },
            this.y = {
                a: -0.268,
                b: 0.827,
                c: 0.379747,
                d: -0.943,
                e: -0.072,
                f: 1.2,
            },
            this.z = {
                a: -0.47,
                b: 0.041,
                c: 0,
                d: 0.914,
                e: -0.531646,
                f: 0.364557
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
            opacity: 0.8
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

            // xnew = g("x", "a") + x * (g("x", "b") + g("x", "c") * x + g("x", "d") * y) + y * (g("x", "e") + g("x", "f") * y)
            // ynew = g("y", "a") + g("y", "b") + g("y", "c") * z + g("y", "d") * Math.abs(x) + g("y", "e") * Math.abs(y) + g("y", "f") * Math.abs(z)
            // znew = g("z", "a") + z * (g("z", "b") + g("z", "c") * z + g("z", "d") * x) + x * (g("z", "e") + g("z", "f") * x)


            xnew = g("x", "a") + x * (g("x", "b") + g("x", "c") * x + g("x", "d") * y) + y * (g("x", "e") + g("x", "f") * y)
            ynew = g("y", "a") + y * (g("y", "b") + g("y", "c") * y + g("y", "d") * z) + z * (g("y", "e") + g("y", "f") * z)
            znew = g("z", "a") + z * (g("z", "b") + g("z", "c") * z + g("z", "d") * x) + x * (g("z", "e") + g("z", "f") * x)


            x = xnew
            y = ynew
            z = znew
            col = Math.abs(map(Math.sin(x + y - z), 0, 1, 200, 360))

            col ? c = new THREE.Color("hsl(" + col + ", 50%, 50%)") : new THREE.Color("hsl(0, 50%, 50%)")
            colors[currentPos] = c.r;
            colors[currentPos + 1] = c.g
            colors[currentPos + 2] = c.b


            positions[currentPos++] = x * 100;
            positions[currentPos++] = y* 100;
            positions[currentPos++] = z* 100;
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