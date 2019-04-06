const numParticles = 10000;

let alpha = 10.82,
    beta = 14.286,
    a = 1.3,
    b = .11,
    c = 7,
    d = 20;
let dt = 0.1;
let line;
$(function () {

    setup();
    camera.position.x = 411.9288657852996
    camera.position.y = 139.651467039443
    camera.position.z = -411.458381486034
    let x = 1;
    let y = 1;
    let z = 0;
    for (let i = 0; i < numParticles; i++) {
        h = -b * Math.sin(((Math.PI * x) / (2 * a)) + d)
        let x1 = alpha * (y - h)
        let y1 = x - y + z;
        let z1 = -beta * y;
        x1 *= dt;
        y1 *= dt;
        z1 *= dt;
        x += x1;
        y += y1;
        z += z1;
        var geometry = new THREE.BoxGeometry(1, 1, 1);
        var material = new THREE.MeshBasicMaterial({
            color: new THREE.Color("hsl(" + (i * 3) % 255 + ", 50%, 50%)")
        });
        var cube = new THREE.Mesh(geometry, material);
        cube.position.x = x * 20
        cube.position.y = y * 20
        cube.position.z = z * 20

        world.add(cube);
    }
    var prev = 0;
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
        for (let x = 0; x < scene.children[0].children.length; x++) {
            ele = scene.children[0].children[x]
            nextel = scene.children[0].children[x + 1]
            if (!nextel)
                nextel = scene.children[0].children[0]
            ele.position.x = nextel.position.x
            ele.position.y = nextel.position.y
            ele.position.z = nextel.position.z
        }

    }



    // setStage();
    // create();
    loop();

    $("#canvas").append(renderer.domElement);
});