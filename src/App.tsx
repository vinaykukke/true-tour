import React, { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import setup from "./three-js/setup";
import Pano from "./components/Pano";
import { DEFAULT_DATA } from "./data";
import "./App.scss";
import Tools from "./components/Tools";
import { useUpdate } from "./context";

/** Selected / Draggable objects */
let draggableObject: THREE.Object3D;

/** Vectors for mouse events */
const clickMouse = new THREE.Vector2();
const moveMouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

function App() {
  const rootRef = useRef(null);
  const { setSelectedObj } = useUpdate();

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const doubleClick = event.detail === 2;
    const singleClick = event.detail === 1;

    /** Drop the object */
    if (singleClick && draggableObject) {
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
      if (doubleClick) draggableObject = obj;
      setSelectedObj(obj);
    }

    /** Clear selectedObject once focus is shifted from hotspot */
    if (obj.name === "mesh__pano") {
      /** Removes the focus of newly added hotspot */
      const hs = document.getElementsByClassName("hotspot__focus");
      for (let i = 0; i < hs.length; i++) {
        const element = hs[i];
        element.classList.remove("hotspot__focus");
      }

      /** Remove the selected object */
      setSelectedObj(null);
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    /** calculate pointer position in normalized device coordinates (-1 to +1) */
    moveMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    moveMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  };

  const handleZoom = (event: React.WheelEvent<HTMLDivElement>) => {
    const zoom = camera.zoom;
    const zoomIn = event.deltaY < 0 && zoom <= DEFAULT_DATA.camera_zoom__max;
    const zoomOut = event.deltaY > 0 && zoom >= DEFAULT_DATA.camera_zoom__min;

    if (zoomIn) camera.zoom = zoom + 0.2;
    if (zoomOut) camera.zoom = zoom - 0.2;

    /** Update the projection matrix */
    camera.updateProjectionMatrix();
  };

  const resizeRendererToDisplaySize = (root: HTMLElement) => {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize =
      width !== root.clientWidth || height !== root.clientHeight;

    if (needResize) {
      renderer.setSize(root.clientWidth, root.clientHeight);
      labelRenderer.setSize(root.clientWidth, root.clientHeight);
    }

    return needResize;
  };

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
          /** If the intersected object is not a pano OR is a hotspot the skip it and move to next item */
          if (item.object.name !== "mesh__pano") return;

          draggableObject.position.copy(item.point.clone());
        });
      }

      /** Enable OrbitalControl once the dragging is finished */
      controls.enable();
    }
  };

  useEffect(() => {
    /** Initial Setup */
    setup();

    /** Get all the mesh */
    const pano = Pano({
      img: "/pano_1.jpg",
    });
    /** Set the position of the pano */
    pano.position.set(0, 0, 0);

    /** Add to scene */
    scene.add(pano); // World Space

    function animate() {
      if (resizeRendererToDisplaySize(rootRef.current)) {
        camera.aspect =
          rootRef.current.clientWidth / rootRef.current.clientHeight;
        camera.updateProjectionMatrix();
      }

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

  return (
    <Suspense fallback={null}>
      <div
        ref={rootRef}
        id="three-js__root"
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onWheel={handleZoom}
      />
      <Tools onMouseMove={handleMouseMove} />
    </Suspense>
  );
}

export default App;
