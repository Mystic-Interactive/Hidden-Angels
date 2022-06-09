let skyBoxGeo, skybox; // declare important variables

function sky(){// function to make skybox
    skyBoxGeo = new THREE.BoxGeometry(500,500,500); //make a cube
    let materialArray = [];

    // Load all the tetxures to fill the cube's interior
    let texture_ft = new THREE.TextureLoader().load('../res/textures/skybox/corona_ft.png');
    let texture_bk = new THREE.TextureLoader().load('../res/textures/skybox/corona_bk.png');
    let texture_up = new THREE.TextureLoader().load('../res/textures/skybox/corona_up.png');
    let texture_dn = new THREE.TextureLoader().load('../res/textures/skybox/corona_dn.png');
    let texture_rt = new THREE.TextureLoader().load('../res/textures/skybox/corona_rt.png');
    let texture_lf = new THREE.TextureLoader().load('../res/textures/skybox/corona_lf.png');

    //Add all textures to array as materials
    materialArray.push(new THREE.MeshBasicMaterial({map: texture_ft, side: THREE.DoubleSide}));
    materialArray.push(new THREE.MeshBasicMaterial({map: texture_bk, side: THREE.DoubleSide}));
    materialArray.push(new THREE.MeshBasicMaterial({map: texture_up, side: THREE.DoubleSide}));
    materialArray.push(new THREE.MeshBasicMaterial({map: texture_dn, side: THREE.DoubleSide}));
    materialArray.push(new THREE.MeshBasicMaterial({map: texture_rt, side: THREE.DoubleSide}));
    materialArray.push(new THREE.MeshBasicMaterial({map: texture_lf, side: THREE.DoubleSide}));

    // create skybox from cube and materials array
    skybox = new THREE.Mesh(skyBoxGeo,materialArray);

    return skybox;
}

export { sky }
