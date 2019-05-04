const numParticles = 100000;
let currentPos = 0;
let colorPos = 0;
let interval;
let starField
let x = 0,
    y = 0;

class options{
    constructor(){
        this.a = .13; //Dat.gui wouldn't allow anything below .1 :(
        this.b = .37; //these get divided by 10,000 in the algorithm

        this.color = [0, 255, 255];
    }
}
$(function () {
    opts = new options()
    const gui = new dat.GUI();
    gui.add(opts, 'a').min(0).max(1).step(0.001)
    gui.add(opts, 'b').min(0).max(1).step(0.001)
    setup();
    camera.position.z = 500;
    // camera.position.x = -1000

    
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
        }
        for (let index = 0; index < numParticles/10; index++) {
            var positions = starField.geometry.attributes.position.array;
            var colors = starField.geometry.attributes.color.array;
            newx = Math.sin(x * y / opts.b) * y + Math.cos(opts.a * x - y)
            newy = x + Math.sin(y) /opts.b
            x = newx;
            y = newy;

            colors[colorPos++] = opts.color[0];
            colors[colorPos++] = opts.color[1];
            colors[colorPos++] = opts.color[2];

            positions[currentPos++] = x * 20;
            positions[currentPos++] = y * 20;
            positions[currentPos++] = 0;
    
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