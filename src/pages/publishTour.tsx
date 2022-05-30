import { Suspense, useEffect } from "react";
import * as THREE from "three";
import setup from "../three-js/setup";
import Pano from "../components/Pano";
import Hotspot from "../components/Hotspot";
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
    /** Initial Setup */
    setup();

    /** Get all the mesh */
    const pano = Pano({
      img: "/pano_1.jpg",
    });
    /** Set the position of the pano */
    pano.position.set(0, 0, 0);

    const pano2 = Pano({
      img: "/pano_2.jpg",
    });
    pano2.position.set(0, 0, 5 * DEFAULT_DATA.pano_radius);

    const hotspot = Hotspot();
    hotspot.position.set(60, 0, -195);

    const hotspot2 = Hotspot();
    hotspot2.position.set(150, 0, -195);

    const hotspot3 = Hotspot();
    hotspot3.position.set(60, 0, -195);

    const hotspot4 = Hotspot();
    hotspot4.position.set(180, 0, -195);

    const hotspot5 = Hotspot();
    hotspot5.position.set(300, 0, -195);

    /** Getting the position of the object in world space */
    pano2.updateWorldMatrix(true, false);
    pano2.getWorldPosition(pos);

    /** Making a group */
    pano.add(hotspot, hotspot2);
    pano2.add(hotspot3, hotspot4, hotspot5);

    /** Add to scene */
    scene.add(pano, pano2); // World Space

    function animate() {
      /** Only required if controls.enableDamping = true, or if controls.autoRotate = true */
      controls.update();

      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);

      requestAnimationFrame(animate);
    }

    animate();
  }, []);

  return (
    <Suspense fallback={null}>
      <div id="three-js__root" onClick={handleClick} />;
    </Suspense>
  );
};

export default PublishTour;
