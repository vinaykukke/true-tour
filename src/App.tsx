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
    const intersectedObjects = raycaster.intersectObjects<
      THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>
    >(scene.children);
    console.log("p: ", scene.children);
    const clickedItem = intersectedObjects.length > 0 && intersectedObjects[0];
    const clickedHotspot = clickedItem.object.userData.type === "hotspot";

    if (clickedHotspot) {
      controls.unlock();
      camera.position.set(pos.x, pos.y, pos.z + 0.1);
      controls.target.set(pos.x, pos.y, pos.z);
      controls.lock();
    }
  };

  useEffect(() => {
    /** Initial Setup */
    setup();

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
    const pitch = 4.27805165630167;
    const yaw = 46.34805821704455;
    const sinPitch = Math.sin(pitch);
    const cosPitch = Math.cos(pitch);
    const sinYaw = Math.sin(yaw);
    const cosYaw = Math.cos(yaw);
    const p = new THREE.Vector3(cosPitch * cosYaw, cosPitch * sinYaw, sinPitch);
    console.log("p: ", p);
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
    </Suspense>
  );
}

export default App;
