const numParticles = 6000000;
let currentPos = 0
let interval;

let x = 0,
    y = 0,
    a = 4.6000000//0.65343,
    b = 5.98336000//0.7345345;


let dt = 12
$(function () {
    setup();

    controls.enabled = false;
    camera.position.z = -1000
    var starsGeometry = new THREE.BufferGeometry();
    var positions =  new Float32Array(numParticles * 2); // 3 vertices per point
    starsGeometry.addAttribute('position', new THREE.BufferAttribute(positions, 2));
    var starsMaterial = new THREE.PointsMaterial({
        color: 0x00FFFF,
        opacity: 0.1
    });

    var starField = new THREE.Points(starsGeometry, starsMaterial);

    scene.add(starField)



    let up = function () {
        if(currentPos >= numParticles) {
            clearInterval(interval);
            currentPos += " (Max)"
            return
        }
        for (let index = 0; index < 2000 ; index++) {
           
            var positions = starField.geometry.attributes.position.array;
            newx = Math.sin(x * y / b) * y + Math.cos(a * x - y)
            newy = x + Math.sin(y) / b


            x = newx;
            y = newy;
            positions[currentPos++] = x * 100;
            positions[currentPos++] = y * 100;

        }
        starField.geometry.attributes.position.needsUpdate = true;

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
            $("#fps").text("fps: " + Math.round(fps * 10) + " " + currentPos + " Iterations")
        }


    }
    loop();
    interval = setInterval(function () {
        up();
    }, 0)

    $("#canvas").append(renderer.domElement);
});