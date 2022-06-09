let skyBoxGeo, skybox; // declare important variables

function sky(){// function to make skybox
    skyBoxGeo = new THREE.BoxGeometry(500,500,500); //make a cube
    let materialArray = [];

    // // Load all the tetxures to fill the cube's interior
    // let texture_ft = new THREE.TextureLoader().load('../res/textures/skybox/kenon_star_ft.jpg');
    // let texture_bk = new THREE.TextureLoader().load('../res/textures/skybox/kenon_star_bk.jpg');
    // let texture_up = new THREE.TextureLoader().load('../res/textures/skybox/kenon_star_up.jpg');
    // let texture_dn = new THREE.TextureLoader().load('../res/textures/skybox/kenon_star_dn.jpg');
    // let texture_rt = new THREE.TextureLoader().load('../res/textures/skybox/kenon_star_rt.jpg');
    // let texture_lf = new THREE.TextureLoader().load('../res/textures/skybox/kenon_star_lf.jpg');

    // Load all the tetxures to fill the cube's interior
    let texture_ft = new THREE.TextureLoader().load('../res/textures/skybox_new/corona_ft.png');
    let texture_bk = new THREE.TextureLoader().load('../res/textures/skybox_new/corona_bk.png');
    let texture_up = new THREE.TextureLoader().load('../res/textures/skybox_new/corona_up.png');
    let texture_dn = new THREE.TextureLoader().load('../res/textures/skybox_new/corona_dn.png');
    let texture_rt = new THREE.TextureLoader().load('../res/textures/skybox_new/corona_rt.png');
    let texture_lf = new THREE.TextureLoader().load('../res/textures/skybox_new/corona_lf.png');

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
