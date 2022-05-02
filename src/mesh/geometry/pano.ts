import * as THREE from "three";

const getPano = () => {
  /** Texture */
  const loader = new THREE.TextureLoader();
  const texture = loader.load("/pano_inside.jpg");

  /** Pano Dome */
  const geometry = new THREE.SphereBufferGeometry(200, 100, 50);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    color: 0xffffff,
    side: THREE.BackSide,
  });

  return new THREE.Mesh(geometry, material);
};

export default getPano;
