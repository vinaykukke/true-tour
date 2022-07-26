import * as THREE from "three";

export const getScreenCenter = (raycaster: THREE.Raycaster = null) => {
  /** Check if there is already an existing raycaster */
  if (!raycaster) raycaster = new THREE.Raycaster();

  const screenCentre = new THREE.Vector3(0, 0, 0.5);
  screenCentre.unproject(global.camera).sub(global.camera.position).normalize();

  raycaster.set(global.camera.position, screenCentre);

  const found = raycaster.intersectObjects(global.scene.children);
  const obj = found.length > 0 && found[0];

  return obj.point;
};
