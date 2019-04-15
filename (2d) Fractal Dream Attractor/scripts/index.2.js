const numParticles = 1000000;

let scale = 10000
// let a=-0.966918, b=2.879879, c=0.765145,d=0.744728

let x = -2,
    y = -2,
    z = 0;
let line;

class options {
    constructor() {
        this.a = -0.966918 * scale; //Dat.gui wouldn't allow anything below .1 :(
        this.b = 2.879879 * scale; //these get divided by ${scale} in the algorithm
        this.c = 0.765145 * scale;
        this.d = 0.744728 * scale;
        
    }
}


$(function () {
    setup();

    opts = new options()
    const gui = new dat.GUI();
    gui.add(opts, 'a', -30000, 30000).name("a / " + scale)
    gui.add(opts, 'b', -300000, 300000).name("b / " + scale)
    gui.add(opts, 'c', -5000, 15000).name("c / " + scale)
    gui.add(opts, 'd', -5000, 15000).name("d / "  + scale)


    // camera.position.z = 1000
    var prev = 0;
    var starsGeometry = new THREE.Geometry();

    for (let i = 0; i < numParticles; i++) {
        // console.log("sdaf")
        a = opts.a / scale
        b = opts.b / scale
        c = opts.c / scale
        d = opts.d / scale


        xnew = Math.sin(b * y) +c * Math.sin(b * x)
        ynew = Math.sin(a * x) + d * Math.sin(a * y)
        x = xnew
        y = ynew


        var star = new THREE.Vector3();
        star.x = xnew * 200
        star.y = ynew * 200
        star.z = 0

        starsGeometry.vertices.push(star);
    }
    var starsMaterial = new THREE.PointsMaterial({
        color: 0x888888,
        opacity:.5
    });
    var starField = new THREE.Points(starsGeometry, starsMaterial);
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
        // scene.rotation.y += 0.01
    }
    loop();
    $("#canvas").append(renderer.domElement);
});