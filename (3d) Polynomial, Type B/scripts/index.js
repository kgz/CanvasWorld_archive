const numParticles = 20000;
let currentPos = 0;
let x = 0,
    y = 0,
    z = 0;
class options {
    constructor() {
        this.a = 1.6691
        this.b = 1.0405
        this.c = 0.2818
        this.d = 0.2818
        this.e = 0
        this.f = 1.1055000000000001
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
            // color: 0xffa500,
            transparent:true,
            opacity:0.8
        });
        starField = new THREE.Points(starsGeometry, starsMaterial);
        scene.add(starField);
    }
    opts = new options()
    const gui = new dat.GUI();

    gui.add(opts, 'a').min(0).max(2).step(0.0001)
    gui.add(opts, 'b').min(0).max(2).step(0.0001)
    gui.add(opts, 'c').min(0).max(2).step(0.0001)
    gui.add(opts, 'd').min(0).max(2).step(0.0001)
    gui.add(opts, 'e').min(0).max(2).step(0.0001)
    gui.add(opts, 'f').min(0).max(2).step(0.0001)
    setup();
    var prev = 0;
    gen()
    var positions = starField.geometry.attributes.position.array;
    var colors = starField.geometry.attributes.color.array

    let up = function (){
        if (currentPos >= numParticles) {
            currentPos = 0;
            x = 0;
            y = 0;
            z = 0;
        }
        for (let i = 0; i < numParticles; i++) {
           
      
            xnew= opts.a + y - z * (opts.b * y)
            ynew= opts.c + z - x * (opts.d * z)
            znew= opts.e + x - y * (opts.f * x)            
           
            x = xnew
            y = ynew
            z = znew
            col = Math.abs(map(Math.sin(x + y - z), 0, 1, 200, 360))
            
            col ? c = new THREE.Color("hsl(" + col + ", 50%, 50%)") : new THREE.Color("hsl(0, 50%, 50%)") 
            colors[currentPos] = c.r;
            colors[currentPos + 1] = c.g
            colors[currentPos + 2] = c.b


            positions[currentPos++] = x * 100;
            positions[currentPos++] = y * 100;
            positions[currentPos++] = z  * 100;
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




