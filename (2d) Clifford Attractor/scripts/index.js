const numParticles = 500000;
let currentPos = 0;
let colorPos = 0;
let interval;
let starField
let x = 0.1,
    y = 0.1;

class options{
    constructor(){
        this.a = 1700; //Dat.gui wouldn't allow anything below .1 :(
        this.b = 1800; //these get divided by 1,000 in the algorithm
        this.c = 1900;
        this.d = 400;
        this.color = [0, 255, 255]
        this.Particles = 200000
    }
}
$(function () {
    opts = new options()
    const gui = new dat.GUI();
    gui.add(opts, 'a', -3000, 3000).name("a / 1000")
    gui.add(opts, 'b',  -3000, 3000).name("b / 1000")
    gui.add(opts, 'c',  -3000, 3000).name("c / 1000")
    gui.add(opts, 'd',  -3000, 3000).name("d / 1000")
    gui.addColor(opts, "color")
    setup();
    // camera.position.z = 100;
    // camera.position.x = -1000

    
    var starsGeometry = new THREE.BufferGeometry();
    starsGeometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(numParticles * 2), 2));
    starsGeometry.addAttribute('color', new THREE.BufferAttribute(new Float32Array(numParticles*3), 3));
    var starsMaterial = new THREE.PointsMaterial({vertexColors: THREE.VertexColors});
    starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField)

    let up = function () {
        if(currentPos >= numParticles) {
            // clearInterval(interval)
            currentPos = 0;
            colorPos = 0;  
            x= 0.1;
            y = 0.1
        }
        for (let index = 0; index < numParticles/100; index++) {
            var positions = starField.geometry.attributes.position.array;
            var colors = starField.geometry.attributes.color.array;
            a = opts.a / 1000;
            b = opts.b / 1000;
            c = opts.c / 1000;
            d = opts.d / 1000;

            newx = Math.sin(a * y) + c * Math.cos(a * x);
            newy = Math.sin(b * x) + d * Math.cos( b * y);

            x = newx;
            y = newy;
            colors[colorPos++] = opts.color[0];
            colors[colorPos++] = opts.color[1];
            colors[colorPos++] = opts.color[2];

            positions[currentPos++] = x * 100;
            positions[currentPos++] = y * 100;
    
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
    }
    loop();
    interval = setInterval(function () {
        up();
    }, 0)

    $("#canvas").append(renderer.domElement);
});