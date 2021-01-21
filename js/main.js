let camera, scene, renderer, ground, controls, model, loadingScreen, canvas, delta;

const mixers = [], clock = new THREE.Clock();

let gemsY = [];

function onload() {

    switchScene( 0 );
    animate();

}

let modelList = [

    {
        name: "crash.glb", url: 'Characters/crash.glb', platformPostion : new THREE.Vector3( 0, -1.59, 0 )
    },
    {
        name: "agent_crash.glb", url: 'Characters/agent_crash.glb', platformPostion : new THREE.Vector3( 0, -1.69, 0 )
    },
    {
        name: "coco.glb", url: 'Characters/coco.glb', platformPostion : new THREE.Vector3( 0, -1.69, 0 )
    },
    {
        name: "caveman_crash.glb", url: 'Characters/caveman_crash.glb', platformPostion : new THREE.Vector3( 0, -1.69, 0 )
    },
    {
        name: "crunch.glb", url: 'Characters/crunch.glb', platformPostion : new THREE.Vector3( -0.05, -1.69, 0 )
    },
    {
        name: "rapper_crash.glb", url: 'Characters/rapper_crash.glb', platformPostion : new THREE.Vector3( 0, -1.69, 0 )
    },
    {
        name: "cortex.glb", url: 'Characters/cortex.glb', platformPostion : new THREE.Vector3( 0, -1.69, 0 )
    },
    {
        name: "n-trophy.glb", url: 'Characters/n-trophy.glb', platformPostion : new THREE.Vector3( 0, -1.69, 0 )
    },
    {
        name: "tiny_tiger.glb", url: 'Characters/tiny_tiger.glb', platformPostion : new THREE.Vector3( 0, -1.69, 0 )
    },
];

let gems = [

    {
        obj_file: 'Blue_Gem.obj', gem_position: new THREE.Vector3( 3.2, -0.2, -15 ), color: 0x0e55c7
    },
    {
        obj_file: 'Yellow_Gem.obj', gem_position: new THREE.Vector3( 4, 1.8, -15 ), color: 0xe6de09
    },
    {
        obj_file: 'Red_Gem.obj', gem_position: new THREE.Vector3( -2, 1.5, -15 ), color: 0x87000d
    },
    {
        obj_file: 'Green_Gem.obj', gem_position: new THREE.Vector3( 1.8, 3.8, -18 ), color: 0x00b00f
    },
    {
        obj_file: 'Purple_Gem.obj', gem_position: new THREE.Vector3( -4, -0.5, -18 ), color: 0x9100b5
    },
]

function init( character ) {

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 45, 2, 1, 1000 );
    camera.position.set( 0, 0, 5 );
    scene.add( camera );

    let directionalLight1 = new THREE.DirectionalLight( 0xf2f2f2, 1 );
    directionalLight1.position.set( 0, 5, 0 );
    scene.add( directionalLight1 );

    let directionalLight2 = new THREE.DirectionalLight( 0xf2f2f2, 1 );
    directionalLight2.position.set( 0, -5, 0 );
    scene.add( directionalLight2 );

    const cameraLight  = new THREE.DirectionalLight( 0xf2f2f2, 5 );
    camera.add( cameraLight );

    const loadingManager = new THREE.LoadingManager( () => {
	
        loadingScreen = document.getElementById( 'loading-screen' );
        loadingScreen.classList.add( 'fade-out' );

    } );

    let sceneInfo = modelList[ character ]; //character from array of  models in html radio options
    let url = sceneInfo.url;
    let platformPostion = sceneInfo.platformPostion;
    let name = sceneInfo.name;

    const loader = new THREE.GLTFLoader( loadingManager );
    loader.load( url, function ( gltf ) {

        model = gltf.scene;
        model.position.set( 0, -0.5, 0 );

        scene.add( model );

        const mixer = new THREE.AnimationMixer( model );
        mixer.clipAction( gltf.animations[ 0 ] ).play();
        mixers.push( mixer );

    } );

    loader.load( 'Items/crate.glb', function ( gltf ) {

        crate = gltf.scene;
        crate.position.set( platformPostion.x, platformPostion.y, platformPostion.z );
        crate.scale.set( 0.6, 0.6, 0.6 );

        scene.add( crate );

    } );

    let gem_obj = new THREE.OBJLoader( loadingManager ).setPath( 'Items/Gems/' );

    gems.forEach( gem => {

        gem_obj.load( gem.obj_file, function ( object ) {

                object.scale.set( 0.1, 0.1, 0.1 );
                object.position.set( gem.gem_position.x, gem.gem_position.y, gem.gem_position.z );

                let gem_material = new THREE.MeshPhongMaterial( {
                    color: gem.color,
                } );

                object.traverse( function ( child ) {

                    if ( child instanceof THREE.Mesh ) {
            
                        child.material = gem_material;
                        child.material.side = THREE.DoubleSide;

                    }
            
                } );

                gemsY.push( object );
                object.userData.initFloating = Math.random() * Math.PI * 2;
                camera.add( object );

            } );
      
    });
  
    renderer = new THREE.WebGLRenderer( { canvas: document.querySelector("canvas"), antialias: true, alpha: true } ); //, alpha: true
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.physicallyCorrectLights = true;
    renderer.outputEncoding = THREE.sRGBEncoding;

    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.minPolarAngle = Math.PI / 2;
    controls.maxPolarAngle = Math.PI / 2;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    window.addEventListener( 'resize', onWindowResize, false );

}

function resizeCanvasToDisplaySize() {

    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if ( canvas.width !== width || canvas.height !== height ) {

        renderer.setSize( width, height, false );
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        controls.update();
       
    }

}

function onWindowResize() {

    resizeCanvasToDisplaySize();

}

function switchScene( character ) {

    clear();
    init( character );

}

function selectModel() {

    let index = document.querySelector( '#radio-div input[name="character"]:checked' ).value;
    
    if ( index.length >= 0 ) {

        switchScene( index );
    }


}

function clear() {

    if( model !== undefined ){
        
        scene.remove( model );
        loadingScreen.classList.remove( 'fade-out' );
    }
    
}

function animate() {

    requestAnimationFrame( animate );

    render();

}

function render() {

    delta = clock.getDelta();
    let time = clock.getElapsedTime();

    if( model !== undefined ){
      
        for( let i = 0; i < mixers.length; i++ ){
    
            mixers[ i ].update( delta );
    
        }
    }

    resizeCanvasToDisplaySize();

    gemsY.forEach( gemY => {

        gemY.rotation.y += ( Math.PI / 100 );
        gemY.position.y += Math.sin( gemY.userData.initFloating + time ) * 0.005;

    } );

    renderer.render( scene, camera );
    
}

onload();
