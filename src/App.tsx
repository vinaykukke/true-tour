import React, { Suspense, useEffect } from "react";
import * as THREE from "three";
import setup from "./three-js/setup";
import Pano from "./mesh/geometry/pano";
import Hotspot from "./mesh/geometry/hotspot";
import "./App.scss";

const clickMouse = new THREE.Vector2();
const moveMouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
let draggableObject: THREE.Object3D;

window.addEventListener("click", (event: MouseEvent) => {
  if (draggableObject) {
    draggableObject = null;
    return;
  }
  /** calculate pointer position in normalized device coordinates (-1 to +1) */
  clickMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  clickMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  /** Set the camera from which the ray should orginate and to what coordinates it should go to */
  raycaster.setFromCamera(clickMouse, camera);

  /**
   * Calculate objects intersecting the picking ray.
   * The array is sorted. Meaning that closest intersecting object is at position 0.
   */
  const found = raycaster.intersectObjects<
    THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>
  >(scene.children);
  const obj = found.length > 0 && found[0].object;

  if (obj.userData.draggable) {
    draggableObject = obj;
  }
});

window.addEventListener("mousemove", (event: MouseEvent) => {
  /** calculate pointer position in normalized device coordinates (-1 to +1) */
  moveMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  moveMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

const dragObject = () => {
  if (draggableObject) {
    /** Disable OrbitalControl if user is dragging object */
    controls.disable();

    /** Set the camera from which the ray should orginate and to what coordinates it should go to */
    raycaster.setFromCamera(moveMouse, camera);

    const found = raycaster.intersectObjects<
      THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>
    >(scene.children);

    if (found.length > 0) {
      found.forEach((item) => {
        if (item.object.userData.draggable) {
          draggableObject.position.x = item.point.x;
          draggableObject.position.y = item.point.y;
        }
      });
    }

    /** Enable OrbitalControl once the dragging is finished */
    controls.enable();
  }
};

function App() {
  useEffect(() => {
    /** Initial Setup */
    setup();

    /** Get all the mesh */
    const pano = Pano({
      x: 0,
      y: 0,
      z: 0,
      img: "/pano_1.jpg",
    });

    const hotspot = Hotspot({
      x: 60,
      y: 0,
      z: -195,
    });

    /** Making a group */
    pano.add(hotspot);

    /** Add to scene */
    scene.add(pano); // World Space

    function animate() {
      /** Only required if controls.enableDamping = true, or if controls.autoRotate = true */
      controls.update();

      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);

      /** Enables object dragging */
      dragObject();

      requestAnimationFrame(animate);
    }

    animate();
  }, []);

  const addHotspot = () => {
    const pano = scene.getObjectByName("mesh__pano");
    const hs = Hotspot();
    pano.add(hs);
  };

  return (
    <Suspense fallback={null}>
      <div id="three-js__root" />
      <div className="hotspot__add" onClick={addHotspot}>
        Add Hotspot
      </div>
      <div className="hotspot__delete">Delete Hotspot</div>
    </Suspense>
  );
}

export default App;
