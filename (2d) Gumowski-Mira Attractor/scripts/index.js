const numParticles = 500000 //1000000;
let currentPos = 0;
let colorPos = 0;
let interval;
let starField
let x = 0,
    y = 0.5,
    z = 0;
class options {
    constructor() {
        this.a = 0.000001;
        this.b = 0.780; 
        this.u = 0.99424;
    }
}
$(function () {
    opts = new options()
    const gui = new dat.GUI();
    gui.add(opts, 'a').min(0).max(1).step(0.00001)
    gui.add(opts, 'b').min(0).max(1).step(0.00001)
    gui.add(opts, 'u').min(-1).max(1).step(0.00001)
    setup();
    var starsGeometry = new THREE.BufferGeometry();
    starsGeometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(numParticles * 3), 3));
    starsGeometry.addAttribute('color', new THREE.BufferAttribute(new Float32Array(numParticles * 3), 3));
    var starsMaterial = new THREE.PointsMaterial({
        vertexColors: THREE.VertexColors
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
            x = 0;
            y = 0.5;
            z = 0;
        }
        for (let index = 0; index < numParticles / 100; index++) {
            let a = opts.a ;
            let b = opts.b;
            let dt = opts.u -1 ;
            // f = (xx) => u * xx + 2 * (1 - u) * Math.pow(xx, 2) / (1 + Math.pow(xx, 2))
            // let x1 = y + a * (1 - b * Math.pow(y, 2)) * y + f(x) //x1 = b * y + w(x)
            // let y1 = x + f(x1)
            function f(x) {
                var xx = x * x;
                return (dt * x) + ((2.0 * (1.0 - dt) * xx) / (1.0 + xx));
            }
            x1 = y + (a * (1.0 - (b * y * y)) * y) + f(x);
            y1 = -x + f(x1);


            x = x1 ;
            y = y1 ;


            positions[currentPos++] = x * 10;
            positions[currentPos++] = y*10;
            positions[currentPos++] = 0;
            //dt+= 0.00001
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