import { Object3D } from "three";
import { TPano } from "src/types/pano";

/** Moves the camera to a the newly added pano */
export const moveCamera = (pano: TPano | Object3D) => {
  controls.unlock();
  camera.position.setZ(pano.position.z + 0.1);
  controls.target.copy(pano.position.clone());
  controls.lock();
};
