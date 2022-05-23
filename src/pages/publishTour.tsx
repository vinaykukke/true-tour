import { Suspense, useEffect } from "react";
import * as THREE from "three";
import Pano from "../mesh/geometry/pano";
import Hotspot from "../mesh/geometry/hotspot";
import { DEFAULT_DATA } from "../data";

const mousePosOnClick = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
const pos = new THREE.Vector3();

const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
  /** calculate pointer position in normalized device coordinates (-1 to +1) */
  mousePosOnClick.x = (event.clientX / window.innerWidth) * 2 - 1;
  mousePosOnClick.y = -(event.clientY / window.innerHeight) * 2 + 1;

  /** Set the camera from which the ray should orginate and to what coordinates it should go to */
  raycaster.setFromCamera(mousePosOnClick, camera);

  /**
   * Calculate objects intersecting the picking ray.
   * The array is sorted. Meaning that closest intersecting object is at position 0.
   */
  const intersectedObjects = raycaster.intersectObjects<
    THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>
  >(scene.children);
  const clickedItem = intersectedObjects.length > 0 && intersectedObjects[0];
  const clickedHotspot = clickedItem.object.userData.type === "hotspot";

  if (clickedHotspot) {
    controls.unlock();
    camera.position.set(pos.x, pos.y, pos.z + 0.1);
    controls.target.set(pos.x, pos.y, pos.z);
    controls.lock();
  }
};

const PublishTour = () => {
  useEffect(() => {
    /** Get all the mesh */
    const pano = Pano({
      x: 0,
      y: 0,
      z: 0,
      img: "/pano_1.jpg",
    });
    const pano2 = Pano({
      x: 0,
      y: 0,
      z: 15 * DEFAULT_DATA.pano_radius,
      img: "/pano_2.jpg",
    });
    const hotspot = Hotspot({
      x: 60,
      y: 0,
      z: -195,
    });
    const hotspot2 = Hotspot({
      x: 150,
      y: 0,
      z: -195,
    });
    const hotspot3 = Hotspot({
      x: 60,
      y: 0,
      z: -195,
    });
    const hotspot4 = Hotspot({
      x: 180,
      y: 0,
      z: -195,
    });
    const hotspot5 = Hotspot({
      x: 300,
      y: 0,
      z: -195,
    });

    /** Getting the position of the object in world space */
    pano2.updateWorldMatrix(true, false);
    pano2.getWorldPosition(pos);

    /** Making a group */
    pano.add(hotspot, hotspot2);
    pano2.add(hotspot3, hotspot4, hotspot5);

    /** Add to scene */
    scene.add(pano, pano2); // World Space
  }, []);

  return (
    <Suspense fallback={null}>
      <div id="three-js__root" onClick={handleClick} />;
    </Suspense>
  );
};

export default PublishTour;
