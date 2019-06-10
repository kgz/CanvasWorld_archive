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
        this.x ={
            a:0.607407407407407, 
            b:1.159, 
            c:0.281481481481481, 
            d:-0.191,
            e:-0.348, 
            f:-0.176, 
            g:-0.702
        },

        this.y ={
            a:-0.693,
            b:-0.521, 
            c:0.399, 
            d:-0.968, 
            e:0.958,
            f:0.305, 
            g:-0.43
        },

        this.z ={
            a:0.133, 
            b:0.416,
            c:1.144, 
            d:-0.651851851851852, 
            e:-0.844444444444444, 
            f:0.754,
            g:-0.414814814814815
        }

    }
}
$(function () {
    // a = $("<div/>",{
    //     text:"test",
    //     css:{
    //         "positon":"fixed",

    //         "margin-top":$("#canvas").innerHeight() - 50 + "px",
    //         "color":"white"
    //     }   }).appendTo("#canvas")


    opts = new options()
    const gui = new dat.GUI();
    gui.add(opts, 'a').min(-3).max(3).step(0.001).listen();
    gui.add(opts, 'b').min(-3).max(3).step(0.001)
    gui.add(opts, 'c').min(-3).max(3).step(0.001)
    gui.add(opts, 'd').min(-3).max(3).step(0.001)
    gui.add(opts, 'e').min(-3).max(3).step(0.001)

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

        out = map(index % colors.length / 2, 0, colors.length, 200, 360)
        c = new THREE.Color("hsl(" + out + ", 50%, 50%)")
        colors[index] = c.r;
        colors[index + 1] = c.g
        colors[index + 2] = c.b
    }
    scene.add(starField)
    var positions = starField.geometry.attributes.position.array;

    let up = function () {
        opts.a > 3 ? opts.a = -3 : opts.a += 0.001
        if (currentPos >= numParticles) {
            currentPos = 0;
            colorPos = 0;
            x = 0;
            y = 0;
            z = 0;
        }
        for (let index = 0; index < numParticles / 10; index++) {

            xnew = g("x", "a") + g("x", "b") * x + g("x", "c") * y + g("x", "d") * z + g("x", "e") * Math.abs(x) + g("x", "f") * Math.abs(y) + g("x", "g") * Math.abs(z)
            ynew = g("y", "a") + g("y", "b") * x + g("y", "c") * y + g("y", "d") * z + g("y", "e") * Math.abs(x) + g("y", "f") * Math.abs(y) + g("y", "g") * Math.abs(z)
            znew = g("z", "a") + g("z", "b") * x + g("z", "c") * y + g("z", "d") * z + g("z", "e") * Math.abs(x) + g("z", "f") * Math.abs(y) + g("z", "g") * Math.abs(z)

            x = x1;
            y = y1;
            z = z1
            positions[currentPos++] = x * 20;
            positions[currentPos++] = y * 20;
            positions[currentPos++] = z * 20
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
            $("#fps").text("fps: " + Math.round(fps * 10) + " at 100 intervals, a = " + opts.a.toFixed(4))
        }


    }

    loop();
    interval = setInterval(function () {
        up();
    }, 0)

    $("#canvas").append(renderer.domElement);
});