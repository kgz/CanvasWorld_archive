const numParticles = 1000000;
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
        this.a = 1300; //Dat.gui wouldn't allow anything below .1 :(
        this.b = 110; //these get divided by 1,000 in the algorithm
        this.d = 20000;
        this.dt = 0.1;
        this.Particles = 200000
    }
}
$(function () {
    opts = new options()
    const gui = new dat.GUI();
    gui.add(opts, 'a', 0, 3000).name("a / 1000")
    gui.add(opts, 'b',  0, 3000).name("b / 1000")
    gui.add(opts, 'd',  0, 50000).name("d / 1000")
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
        for (let index = 0; index < numParticles/100; index++) {
            var positions = starField.geometry.attributes.position.array;
            a = opts.a / 1000;
            b = opts.b / 1000;
            d = opts.d / 1000;

            h = -b * Math.sin(((Math.PI * x) / (2 * a)) + d)

            let x1 = opts.alpha * (y - h)
            let y1 = x - y + z;
            let z1 = -opts.beta * y;

            x1 *= opts.dt;
            y1 *= opts.dt;
            z1 *= opts.dt;
            x += x1;
            y += y1;
            z += z1;
            positions[currentPos++] = x * 20;
            positions[currentPos++] = y * 20;
            positions[currentPos++] = z * 20;
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