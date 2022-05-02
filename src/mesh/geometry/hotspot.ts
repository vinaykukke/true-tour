import * as THREE from "three";

const getHotspot = () => {
  /** Pano Dome */
  const geometry = new THREE.SphereGeometry(8, 32, 32);
  const material = new THREE.MeshBasicMaterial({
    color: "lightpink",
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(60, 0, -195);
  mesh.layers.enableAll();

  return mesh;
};

export default getHotspot;
