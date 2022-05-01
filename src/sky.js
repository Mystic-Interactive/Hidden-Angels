let skyBoxGeo, skybox;



function sky(){
    skyBoxGeo = new THREE.BoxGeometry(500,500,500);
    let materialArray = [];
    let texture_ft = new THREE.TextureLoader().load('../res/textures/skybox/kenon_star_ft.jpg');
    let texture_bk = new THREE.TextureLoader().load('../res/textures/skybox/kenon_star_bk.jpg');
    let texture_up = new THREE.TextureLoader().load('../res/textures/skybox/kenon_star_up.jpg');
    let texture_dn = new THREE.TextureLoader().load('../res/textures/skybox/kenon_star_dn.jpg');
    let texture_rt = new THREE.TextureLoader().load('../res/textures/skybox/kenon_star_rt.jpg');
    let texture_lf = new THREE.TextureLoader().load('../res/textures/skybox/kenon_star_lf.jpg');

    materialArray.push(new THREE.MeshBasicMaterial({map: texture_ft, side: THREE.DoubleSide}));
    materialArray.push(new THREE.MeshBasicMaterial({map: texture_bk, side: THREE.DoubleSide}));
    materialArray.push(new THREE.MeshBasicMaterial({map: texture_up, side: THREE.DoubleSide}));
    materialArray.push(new THREE.MeshBasicMaterial({map: texture_dn, side: THREE.DoubleSide}));
    materialArray.push(new THREE.MeshBasicMaterial({map: texture_rt, side: THREE.DoubleSide}));
    materialArray.push(new THREE.MeshBasicMaterial({map: texture_lf, side: THREE.DoubleSide}));

    skybox = new THREE.Mesh(skyBoxGeo,materialArray);

    return skybox;
}

export { sky }
