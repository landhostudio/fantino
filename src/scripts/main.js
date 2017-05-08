(function($) {

  'use strict';
  
  var start = function() {

    if ($('.nav').length) {
      startNav();
    };

    if ($('#canvas').length) {
      start3D();
    };

  };

  function startNav() {
    $('.nav-button').click(function(event) {
      $(this).toggleClass('nav-button--opened');
      $('.nav').toggleClass('nav--opened');
    });
  };

  function start3D() {

    var container,
        camera,
        scene,
        renderer;

    var geometry,
        material,
        mesh,
        object;

    var ambientLight,
        pointLight1,
        pointLight2,
        loadingManager;

    var mouseX = 0,
        mouseY = 0;

    var deviceX = 0,
        deviceY = 0;

    var windowHalfX = window.innerWidth / 2,
        windowHalfY = window.innerHeight / 2;

    init();
    animate();

    function init() {

        // Camera --------------------------------------------------------------
        
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
        camera.position.z = 100;
        camera.position.y = 200;

        if (window.innerWidth > 768) {
          camera.position.z = 50;
        } else {
          camera.position.z = 100;
        };

        // Scene ---------------------------------------------------------------

        scene = new THREE.Scene();

        // Lights --------------------------------------------------------------

        var ambientLight = new THREE.AmbientLight( 0x404040, 1, 0 );
        scene.add( ambientLight );

        pointLight1 = new THREE.PointLight( 0xFF80EE, 1, 0 );
        pointLight1.position.set( 100, 0, 0 );
        scene.add( pointLight1 );

        pointLight2 = new THREE.PointLight( 0x21F4FF, 1, 0 );
        pointLight2.position.set( 0, 0, 100 );
        scene.add( pointLight2 );

        // Loader --------------------------------------------------------------

        var loadingManager = new THREE.LoadingManager();

        loadingManager.onProgress = function(item, loaded, total) {
          console.log(item, loaded, total);
        };

        var onProgress = function (xhr) {
          console.log('Downloaded');
        };

        var onError = function (xhr) {
          console.log('Error');
        };

        // Model & material ----------------------------------------------------

        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.load('/models/helmet.mtl', function(materials) {
          materials.preload();
          var objLoader = new THREE.OBJLoader();
          objLoader.setMaterials(materials);
          objLoader.load('/models/helmet.obj', function(object) {
            object.rotation.y = -3.125;
            object.rotation.x = 0.5;
            object.position.x = -2.5
            object.position.y = -3;
            scene.add(object);
          }, onProgress, onError);
        });

        // Render --------------------------------------------------------------

        renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true
        });

        renderer.setPixelRatio(window.devicePixelRatio),
        renderer.setSize(window.innerWidth, window.innerHeight);

        // Events --------------------------------------------------------------

        // If window size is changed
        window.addEventListener('resize', resizeEvent, false);

        function resizeEvent() {
          windowHalfX = window.innerWidth / 2;
          windowHalfY = window.innerHeight / 2;
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          
          if (window.innerWidth > 768) {
            camera.position.z = 50;
          } else {
            camera.position.z = 100;
          };
          
          renderer.setSize(window.innerWidth, window.innerHeight);
          
          // if (window.innerWidth > 768) { console.log('768'); };
          // if (window.innerWidth === 1024) { console.log('1024'); };
          // if (window.innerWidth === 1280) { console.log('1280'); };

        };

        // Mouse touch or click
        window.addEventListener('pointerdown', clickEvent, false);

        function clickEvent() {
          console.log('click or touch yo!');
        };

        // Mouse move
        window.addEventListener('mousemove', mouseEvent, false);

        function mouseEvent(event) {
          mouseX = (event.clientX - windowHalfX) / 2;
          mouseY = (event.clientY - windowHalfY) / 2;
        };

        // If orientation is changed landscape or portrait
        window.addEventListener('orientationchange', orientationEvent, false);

        function orientationEvent() {
          console.log('orientation yo!');
        };

        // Device orientation coordinates
        // Credit: Mozilla
        window.addEventListener('deviceorientation', deviceOrientationEvent, false);

        function deviceOrientationEvent(event) {

          var x = Math.round(event.beta),  // In degree in the range [-180,180]
              y = Math.round(event.gamma); // In degree in the range [-90,90]

          // Because we don't want to have the device upside down
          // We constrain the x value to the range [-90,90]
          if (x >  90) { x =  90};
          if (x < -90) { x = -90};
          
          // To make computation easier we shift the range of x and y to [0,180]
          x += 90;
          y += 90;

          // Show coordinates values in the DOM

          // htmlX = document.querySelector('.x');
          // htmlY = document.querySelector('.y');
          //
          // htmlX.innerHTML = 'X: ' + x + '\n';
          // htmlY.innerHTML = 'Y: ' + y;
          //
          // deviceX = event.gamma;
          // deviceY = event.beta;
          //
          // console.log('X: ' + deviceX + ', Y: ' + deviceY);

        };

        // Add <canvas> to the DOM ---------------------------------------------
        document.getElementById('canvas').appendChild(renderer.domElement);

    }

    function animate() {

      requestAnimationFrame(animate);
      render();

      // Basic animations ------------------------------------------------------

      // mesh.rotation.x += 0.01;
      // mesh.rotation.y += 0.02;
      
      // object.rotation.x += 0.01;
      // object.rotation.y += 0.02;

    }


    function render() {

      // Move camera with cursor coordinates -----------------------------------

      camera.position.x += (- (mouseX / 6) - camera.position.x) * .05;
    	camera.position.y += ((mouseY / 6) - camera.position.y) * .05;

      // Move camera with device coordinates -----------------------------------
      camera.position.x += deviceX * .05;
    	camera.position.y += deviceY * .05;

      // Camera look to object -------------------------------------------------
      camera.lookAt(scene.position);

      // Render updates --------------------------------------------------------
    	renderer.render(scene, camera);

    }

  };

  start();

})(jQuery);
