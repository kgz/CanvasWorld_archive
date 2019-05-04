const numParticles = 300000 //1000000;
let currentPos = 0;
let colorPos = 0;
let interval;
let starField;
let x = 0,
    y = 0,
    z = 0;
let r = 0,
    g = 0,
    b = 0;
let scale = 1000
class options {
    constructor() {
        this.a = -3;
        this.b = 3
        this.c = 3
        this.d = 3;

    }
}
$(function () {
    a = $("<div/>",{
        text:"test",
        css:{
            "positon":"fixed",
            
            "margin-top":$("#canvas").innerHeight() - 50 + "px",
            "color":"white"
        }   }).appendTo("#canvas")


    opts = new options()
    const gui = new dat.GUI();
    gui.add(opts, 'a').min(-3).max(3).step(0.001).listen();
    gui.add(opts, 'b').min(-3).max(3).step(0.001)
    gui.add(opts, 'c').min(-3).max(3).step(0.001)
    gui.add(opts, 'd').min(-3).max(3).step(0.001)

    setup();

 
    var starsGeometry = new THREE.BufferGeometry();
    starsGeometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(numParticles * 3), 3));
    starsGeometry.addAttribute('color', new THREE.BufferAttribute(new Float32Array(numParticles * 3), 3));

    var starsMaterial = new THREE.PointsMaterial({
        vertexColors: THREE.VertexColors,
    });
    starField = new THREE.Points(starsGeometry, starsMaterial);
    const colors = starField.geometry.attributes.color.array

    for (let index = 0; index < starField.geometry.attributes.color.array.length; index += 3) {

        out = map(index % colors.length, 0, colors.length, 200, 360)
        c = new THREE.Color("hsl(" + out+ ", 50%, 50%)")
        colors[index] = c.r;
        colors[index + 1] = c.g
        colors[index + 2] = c.b
    }
    scene.add(starField)
    var positions = starField.geometry.attributes.position.array;

    let up = function () {
        opts.a > 3 ? opts.a = -3 : opts.a += 0.001
        a.text("a = "+ opts.a.toFixed(4))
        if (currentPos >= numParticles) {
            currentPos = 0;
            colorPos = 0;
            x = 0;
            y = 0;
            z = 0;
        }
        for (let index = 0; index < numParticles / 10; index++) {

            x1 = opts.d * Math.sin(opts.a * x) - Math.sin(opts.b * y)
            y1 = opts.c * Math.cos(opts.a * x) + Math.cos(opts.b * y);

            x = x1;
            y = y1;
            positions[currentPos++] = x * 50;
            positions[currentPos++] = y * 50;
            positions[currentPos++] = 0
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