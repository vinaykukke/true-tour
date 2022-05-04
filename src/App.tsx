import React, { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import setup from "./three-js/setup";
import Pano from "./mesh/geometry/pano";
import Hotspot from "./mesh/geometry/hotspot";
import { DEFAULT_DATA } from "./data";
import "./App.scss";

function App() {
  const threejsMountPoint = useRef<HTMLDivElement>(null);
  const pointer = new THREE.Vector2();
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // calculate pointer position in normalized device coordinates
    // (-1 to +1) for both components

    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  };

  useEffect(() => {
    /** Initial setup */
    const groupOne = new THREE.Group();
    const groupTwo = new THREE.Group();
    const raycaster = new THREE.Raycaster();
    const { scene, camera, renderer, controls, labelRenderer } =
      setup(threejsMountPoint);

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

    /** Making a group */
    groupOne.add(pano, hotspot);
    groupTwo.add(pano2);

    /** Add group to scene */
    scene.add(groupOne, groupTwo); // World Space

    function animate() {
      // update the picking ray with the camera and pointer position
      raycaster.setFromCamera(pointer, camera);

      // calculate objects intersecting the picking ray
      const intersects = raycaster.intersectObjects<THREE.Mesh>(scene.children);
      if (intersects.length > 0) {
        intersects.forEach((item) => {
          if (item.object.uuid === hotspot.uuid) {
            controls.unlock();
            camera.position.set(0, 0, 4 * DEFAULT_DATA.pano_radius + 0.1);
            controls.target.set(0, 0, 4 * DEFAULT_DATA.pano_radius);
            controls.lock();
          }
        });
      }

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
      <div id="three-js__root" ref={threejsMountPoint} onClick={handleClick} />
      <div id="hotspot">
        <div id="hotspot__label" />
      </div>
    </Suspense>
  );
}

export default App;
