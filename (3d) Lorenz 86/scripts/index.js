const numParticles = 20000;
let currentPos = 0;
let hasres = true;
let x = 0,
    y = 0,
    z = 0;
class options {
    constructor() {
        this.a = 1.111
        this.b = 4.494
        this.f = 1.479
        this.g = 0.44
        this.d = 0.13
    }
}

let starfield;
$(function () {

    function gen (){
        scene.children = []
        var starsGeometry = new THREE.BufferGeometry();
        starsGeometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(numParticles * 3), 3));
        starsGeometry.addAttribute('color', new THREE.BufferAttribute(new Float32Array(numParticles * 3), 3));
        var starsMaterial = new THREE.PointsMaterial({
            vertexColors: THREE.VertexColors,
            transparent:true,
            opacity:0.8
        });
        starField = new THREE.Points(starsGeometry, starsMaterial);
        starField.rotation.z = Math.PI/2
        scene.add(starField);
    }
    opts = new options()
    const gui = new dat.GUI();
    res = () => {
        hasres = true
    }
    gui.add(opts, 'a').min(.5).max(1.5).step(0.0001).onChange(res)
    gui.add(opts, 'b').min(4).max(5).step(0.0001).onChange(res)
    gui.add(opts, 'g').min(0).max(2).step(0.0001).onChange(res)
    gui.add(opts, 'f').min(0).max(1.5).step(0.0001).onChange(res)
    gui.add(opts, 'd').min(0.1).max(0.15).step(0.00001).onChange(res)
    setup();
    // camera.position.z = -20

    var prev = 0;
    gen()
    var positions = starField.geometry.attributes.position.array;
    var colors = starField.geometry.attributes.color.array

    let up = function (){
        if (currentPos >= numParticles) {
            currentPos = 0;
        //     colorPos = 0;
            x = 0;
            y = 0;
            z = 0;
        }
        for (let i = 0; i < numParticles; i++) {
            if(hasres){
                c = new THREE.Color("hsl(" + Math.abs(map(Math.sin(x*y), 0, 1, 200, 360))+ ", 50%, 50%)")
                colors[currentPos] = c.r;
                colors[currentPos + 1] = c.g
                colors[currentPos + 2] = c.b
            }
            var newx = (-opts.a * x - y * y - z * z + opts.a * opts.b) * opts.d;
            var newy = (-y + x * y - opts.f * x * z + opts.g) * opts.d;
            var newz = (-z + opts.f * x * y + x * z) * opts.d;
            x += newx 
            y += newy 
            z += newz 
            positions[currentPos++] = x * 50;
            positions[currentPos++] = y * 50;
            positions[currentPos++] = z * 50;
        }
        hasres = false;
        stars = starField.geometry.attributes.color.array
        first = (stars[stars.length - 3], stars[stars.length - 2], stars[stars.length - 1])
        for (let x = 2; x < starField.geometry.attributes.color.array.length; x = x + 3) {
            stars[x - 3] = stars[x];
            stars[x - 2] = stars[x + 1];
            stars[x - 1] = stars[x + 2];
        }
        stars[0] = first[0]
        stars[1] = first[1]
        stars[2] = first[2]
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
    }, 70)
    $("#canvas").append(renderer.domElement);
});




