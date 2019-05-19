const numParticles = 100000 //1000000;
let currentPos = 0;
let colorPos = 0;
let interval;
let starField;
let off = 0.0000;
let simlex;
let x = 0,
    y = 0,
    z = 0, 
    w= 500,
    h = 500;
class options {
    constructor() {
        this.scale = 0.02


    }
}

function perlin(index){
    var positions = starField.geometry.attributes.position.array
    x = position[index]



    return value
}
$(function () {
    opts = new options()
    const gui = new dat.GUI();
    gui.add(opts, "scale")
    simlex = new SimplexNoise(off);


    setup();

    var starsGeometry = new THREE.BufferGeometry();
    starsGeometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(numParticles * 3), 3));
    starsGeometry.addAttribute('color', new THREE.BufferAttribute(new Float32Array(numParticles * 3), 3));

    var starsMaterial = new THREE.PointsMaterial({
        vertexColors: THREE.VertexColors,
        // color:new THREE.Color("rgb(0, 255, 255)"),
        size: 5
    });
    starField = new THREE.Points(starsGeometry, starsMaterial);
    var positions = starField.geometry.attributes.position.array;
    for (let index = 0; index < positions.length; index+=3) {
        positions[index] = ((index / 3) % Math.sqrt(positions.length/3)) - Math.sqrt(positions.length/3)/2
        positions[index+1] = ((index /3) / Math.sqrt(positions.length/3)) - Math.sqrt(positions.length/3)/2
        positions[index+2] = 0
    }
    for (let index = 0; index < starField.geometry.attributes.color.array.length; index += 3) {
        const colors = starField.geometry.attributes.color.array

        percent = (index / 255)
        out = percent * 255
        col = Math.abs(Math.round(map(simlex.noise2D(positions[index] * opts.scale, positions[index+1] * opts.scale) + off , 0, 1, 200, 360)))
        c = new THREE.Color("hsl(" + col +", 50%, 50%)")
        colors[index] = c.r;
        colors[index + 1] = c.g
        colors[index + 2] = c.b
        
    }
    scene.add(starField)

    let up = function () {
        off + (off % 1) +  0.1
        // simlex = new SimplexNoise(off);

        for (let index = 0; index < starField.geometry.attributes.color.array.length; index += 3) {
            const colors = starField.geometry.attributes.color.array
            percent = (index / 255)
            out = percent * 255
            col = Math.abs(Math.round(map(simlex.noise2D(positions[index] * opts.scale, positions[index+1] * opts.scale) + off , 0, 1, 200, 360)))
            c = new THREE.Color("hsl(" + col +", 100%, 50%)")
            colors[index] = c.r;
            colors[index + 1] = c.g
            colors[index + 2] = c.b
        }
        starField.geometry.attributes.position.needsUpdate = true;
        starField.geometry.attributes.color.needsUpdate = true;
        controls.update();
        renderer.render(scene, camera);
        off += 0.000001
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

        var positions = starField.geometry.attributes.position.array;


        // stars = starField.geometry.attributes.color.array
        // first = (stars[stars.length - 3], stars[stars.length - 2], stars[stars.length - 1])
        // for (let x = 3; x < starField.geometry.attributes.color.array.length; x = x + 3) {
        //     stars[x - 3] = stars[x];
        //     stars[x - 2] = stars[x + 1];
        //     stars[x - 1] = stars[x + 2];
        // }
        // stars[0] = first[0]
        // stars[1] = first[1]
        // stars[2] = first[2]
        // scene.rotation.x += 0.02
        // scene.rotation.y += 0.01
    }

    loop();
    interval = setInterval(function () {
        up();
    }, 0)

    $("#canvas").append(renderer.domElement);
});