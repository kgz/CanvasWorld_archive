const numParticles = 1000;

let scale = 1
let b = 0.32899
let x = 1,
    y = 1,
    z = 0;
let line;
$(function () {
    setup();
    camera.position.z = -20
    var prev = 0;
    var starsGeometry = new THREE.Geometry();

    for (let i = 0; i < numParticles; i++) {
        // console.log("sdaf")

        newx = Math.sin(y) - b * x
        newy = Math.sin(z) - b * y
        newz = Math.sin(x) - b * z
        x = newx * scale
        y = newy * scale
        z = newz * scale


        var star = new THREE.Vector3();
        star.x = newx
        star.y = newy
        star.z = newz

        starsGeometry.vertices.push(star);
    }
    var starsMaterial = new THREE.LineBasicMaterial({
        color: 0x888888
    });
    var starField = new THREE.Line(starsGeometry, starsMaterial);
    scene.add(starField);
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
        scene.rotation.y += 0.01
    }
    loop();
    $("#canvas").append(renderer.domElement);
});