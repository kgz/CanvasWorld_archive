const numParticles = 100000;
let currentPos = 0;
let colorPos = 0;
let interval;
let starField
let x = 0,
    y = 0,
    z = 0,
    red = 0, green = 0, blue = 0

class options{
    constructor(){
        this.a = 2.695,
        this.b = 1.72,
        this.c = 1.178, 
        this.d = .311
        this.e = -1;
        this.f = -1
    }
}
$(function () {
    opts = new options()
    const gui = new dat.GUI();
    gui.add(opts, 'a').min(-5).max(5).step(0.001)
    gui.add(opts, 'b').min(-5).max(5).step(0.001)
    gui.add(opts, 'c').min(-5).max(5).step(0.001)
    gui.add(opts, 'd').min(-5).max(5).step(0.001)
    gui.add(opts, 'e').min(-5).max(5).step(0.001)
    gui.add(opts, 'f').min(-5).max(5).step(0.001)
    setup();
    
    var starsGeometry = new THREE.BufferGeometry();
    starsGeometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(numParticles * 3), 3));
    starsGeometry.addAttribute('color', new THREE.BufferAttribute(new Float32Array(numParticles*3), 3));
   
    var starsMaterial = new THREE.PointsMaterial({vertexColors: THREE.VertexColors});
    starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField)
    let up = function () {
        if(currentPos >= numParticles) {
            currentPos = 0;
            colorPos = 0;  
            x = 0;
            y = 0;
            z = 0;
        }
        for (let index = 0; index < numParticles/100; index++) {
            var positions = starField.geometry.attributes.position.array;
            var colors = starField.geometry.attributes.color.array
            x1 = Math.sin(opts.a * z) - Math.cos(opts.b * x)
            y1 = Math.sin(opts.c * x) - Math.cos(opts.d * y)
            z1 = Math.sin(opts.e * y) - Math.cos(opts.f * z)
            x = x1;
            y = y1;
            z = z1;
            let ip = 1/(2*Math.PI)
            let v = (x-Math.pow(x1, 2)) + (y - Math.pow(y1, 2)) * Math.atan2(y1, x1)* ip
            red1 = (red+Math.abs(Math.sin(v*Math.PI*3.2-Math.PI*.2)))*.5
            green1 = (green + Math.abs(Math.sin(v*Math.PI*12.3+Math.PI*1.5)*.5+.5))*.5
            blue1 = (blue + Math.sin(v*Math.PI*3.84+Math.PI/2-.6)*.5+.5)*.5
            colors[currentPos] = red1 || 255
            colors[currentPos+1] = green1 || 255
            colors[currentPos+2] = blue1 || 255
            green = green1
            blue = blue1
            red = green1
            positions[currentPos++] = x * 50;
            positions[currentPos++] = y * 50;
            positions[currentPos++] = z * 50;
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