const numParticles = 100000  //1000000;
let currentPos = 0;
let colorPos = 0;
let interval;
let starField;
let x = 0,
    y = 0,
    z = 0;
let scale = 1000
class options {
    constructor() {
        this.u = 0.867 * scale; //Dat.gui wouldn't allow anything below .1 :(

        
    }
}
$(function () {
    opts = new options()
    const gui = new dat.GUI();
    gui.add(opts, 'u', 0, 1000).name("u / " + scale)

    setup();
    var starsGeometry = new THREE.BufferGeometry();
    starsGeometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(numParticles * 3), 3));
    starsGeometry.addAttribute('color', new THREE.BufferAttribute(new Float32Array(numParticles * 3), 3));

    var starsMaterial = new THREE.PointsMaterial({
        vertexColors: THREE.VertexColors,
        // color:new THREE.Color("rgb(0, 255, 255)")
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
            y = 0;
            z = 0;
        }
        for (let index = 0; index < numParticles / 100; index++) {
            u = opts.u /scale
           //t = currentPos/1000// 0.4 - 6/(1 + x^2 + y^2);
            t = 0.4 - (6 / (1+ Math.pow(x, 2) + Math.pow(y, 2)))
            x1 = 1 + u*(x*Math.cos(t) - y*Math.sin(t)) ;
            y1 = u*(x*Math.sin(t) + y*Math.cos(t)) ;

            x = x1 ;
            y = y1 ;
            positions[currentPos++] = x *30; 
            positions[currentPos++] = y *30;
            positions[currentPos++] = 0
        }
        starField.geometry.attributes.position.needsUpdate = true;
        starField.geometry.attributes.color.needsUpdate = true;

        controls.update();
        renderer.render(scene, camera);
    }
    var prev;
    const loop = (now) => {
        // u = u + 0.001 % 1; 
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