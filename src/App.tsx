import React, { Suspense, useEffect } from "react";
import * as THREE from "three";
import setup from "./three-js/setup";
import Pano from "./mesh/geometry/pano";
import Hotspot from "./mesh/geometry/hotspot";
import { DEFAULT_DATA } from "./data";
import "./App.scss";

const mousePosOnClick = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
const pos = new THREE.Vector3();

function App() {
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
    const intersectedObjects = raycaster.intersectObjects<THREE.Mesh>(
      scene.children
    );
    const clickedItem =
      intersectedObjects.length > 0 && intersectedObjects.shift();
    const moveCamera = clickedItem.object.userData.type === "hotspot";

    if (moveCamera) {
      controls.unlock();
      camera.position.set(pos.x, pos.y, pos.z + 0.1);
      controls.target.set(pos.x, pos.y, pos.z);
      controls.lock();
    }
  };

  useEffect(() => {
    /** Setting up Three-js */
    setup();

    /** Initial setup */
    const groupOne = new THREE.Group();
    const groupTwo = new THREE.Group();

    /** Get all the mesh */
    const pano = Pano({
      x: 0,
      y: 0,
      z: 0,
      img: "/pano_inside.jpg",
    });
    const pano2 = Pano({
      x: 0,
      y: 0,
      z: 4 * DEFAULT_DATA.pano_radius,
      img: "/pano_outside.jpg",
    });
    const hotspot = Hotspot({
      x: 60,
      y: 0,
      z: -195,
    });

    /** Getting the position of the object in world space */
    pano2.updateWorldMatrix(true, false);
    pano2.getWorldPosition(pos);

    /** Making a group */
    groupOne.add(pano, hotspot);
    groupTwo.add(pano2);

    /** Add group to scene */
    scene.add(groupOne, groupTwo); // World Space

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
      <div id="three-js__root" onClick={handleClick} />
      <div id="hotspot">
        <div id="hotspot__label" />
      </div>
    </Suspense>
  );
}

export default App;
