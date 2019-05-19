const numParticles = 20000;
let currentPos = 0;
let colorPos = 0;
let interval;
let starField
let x = 1,
    y = 1,
    z = 0;

class options{
    constructor(){
        this.alpha = 10.82;
        this.beta = 14.286;
        this.a = 1.3,
        this.b = 0.11,
        this.d = 2.981;
        this.dt = 0.1;
    }
}
$(function () {
    opts = new options()
    const gui = new dat.GUI();
    gui.add(opts, 'alpha').min(0).max(20).step(0.001)
    gui.add(opts, 'beta').min(10).max(20).step(0.001)
    gui.add(opts, 'a').min(0).max(3).step(0.001)
    gui.add(opts, 'b').min(0).max(3).step(0.001)
    gui.add(opts, 'd').min(0).max(5).step(0.001)
    setup();
    camera.position.x = 411.9288657852996
    camera.position.y = 139.651467039443
    camera.position.z = -411.458381486034
    
    var starsGeometry = new THREE.BufferGeometry();
    starsGeometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(numParticles * 3), 3));
    starsGeometry.addAttribute('color', new THREE.BufferAttribute(new Float32Array(numParticles*3), 3));
   
    var starsMaterial = new THREE.PointsMaterial({vertexColors: THREE.VertexColors});
    starField = new THREE.Points(starsGeometry, starsMaterial);

    for (let index = 0; index < starField.geometry.attributes.color.array.length; index+=3) {
        const colors = starField.geometry.attributes.color.array
        c = new THREE.Color("hsl(" + index % 255 + ", 50%, 50%)")
        colors[index] = c.r;
        colors[index+1] = c.g
        colors[index+2] = c.b
    }


    scene.add(starField)

    let up = function () {
        
        if(currentPos >= numParticles) {
            currentPos = 0;
            colorPos = 0;  
            x = 1;
            y = 1;
            z = 0;
        }
        for (let index = 0; index < numParticles/1; index++) {
            var positions = starField.geometry.attributes.position.array;
           

            h = -opts.b * Math.sin(((Math.PI * x) / (2 * opts.a)) + opts.d)

            let x1 = opts.alpha * (y - h)
            let y1 = x - y + z;
            let z1 = -opts.beta * y;

            x1 *= opts.dt;
            y1 *= opts.dt;
            z1 *= opts.dt;
            x += x1;
            y += y1;
            z += z1;
            positions[currentPos++] = x * 10;
            positions[currentPos++] = y * 10;
            positions[currentPos++] = z * 10;
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

        first = (stars[stars.length -3], stars[stars.length-2], stars[stars.length-1])
        for (let x = 3; x < starField.geometry.attributes.color.array.length; x= x +3) {
            stars[x-3] =  stars[x];
            stars[x-2] = stars[x+1];
            stars[x-1] = stars[x+2];
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