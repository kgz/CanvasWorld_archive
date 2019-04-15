

const numParticles = 200000;

let x = 0,
    y = 0,
    a = 0.65343,
    b = 0.7345345;


let dt = 12
$(function () {
    
    setup();
    controls.enabled = false;
    camera.position.z = -300
    var starsGeometry = new THREE.Geometry();
    

    for (let i = 0; i < numParticles; i++) {
        newx = Math.sin(x*y/b) * y + Math.cos(a*x-y)
        newy = x + Math.sin(y)/b
       
        var star = new THREE.Vector3();

        star.x = newx * dt
        star.y = newy * dt
        
        starsGeometry.vertices.push(star);

        x = newx;
        y = newy;
    }
    var starsMaterial = new THREE.PointsMaterial({
        color: 0x00FFFF
    });
    var starField = new THREE.Points(starsGeometry, starsMaterial);

    world.add(starField)


    var prev;
    const loop = (now) => {
        camera.lookAt(scene.position);
        composer.render();
        rafId = requestAnimationFrame(loop);
        if(rafId % 10 == 0){
            var delta = now - prev;
            var fps = 1000 / delta;
            prev = now;
            $("#fps").text("fps: " + Math.round(fps*10))
        }
    }
    loop();
    $("#canvas").append(renderer.domElement);
});