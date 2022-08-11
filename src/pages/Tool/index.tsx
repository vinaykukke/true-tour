import React, { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import setup from "src/three-js/setup";
import Pano from "src/components/Pano";
import { DEFAULT_DATA } from "src/data";
import "./tools.styles.scss";
import Toolbar from "src/components/Toolbar";
import { useUpdate, useThree } from "src/context/ThreejsContext";

/** Selected / Draggable objects */
let draggableObject: THREE.Object3D;

/** Vectors for mouse events */
const clickMouse = new THREE.Vector2();
const moveMouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

const Tool = () => {
  const rootRef = useRef(null);
  const { previewMode } = useThree();
  const { setSelectedObj } = useUpdate();

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    /** Bounding rect for the canvas */
    const rect = renderer.domElement.getBoundingClientRect();

    /** Offset values for the canvas */
    const x = (event.clientX - rect.left) / renderer.domElement.clientWidth;
    const y = (event.clientY - rect.top) / renderer.domElement.clientHeight;

    /** Click types */
    const doubleClick = event.detail === 2;
    const singleClick = event.detail === 1;

    /** Drop the object */
    if (singleClick && draggableObject) {
      draggableObject = null;
      return;
    }

    /** calculate pointer position in normalized device coordinates (-1 to +1) */
    clickMouse.x = x * 2 - 1;
    clickMouse.y = -y * 2 + 1;

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

    if (!previewMode && obj.userData.draggable) {
      if (doubleClick) draggableObject = obj;
      setSelectedObj(obj);
    }

    if (previewMode && obj.name === "mesh__hotspot") {
      const executable = obj.userData.executable;
      const targetScene = obj.userData.targetScene;
      const execute = executable && Boolean(targetScene);

      if (execute) {
        /** Get all the mesh */
        const pano = Pano({
          img: targetScene,
        });
        /** Set the position of the pano */
        pano.position.set(0, 0, DEFAULT_DATA.pano_radius * 5);

        /** Add to scene */
        scene.add(pano); // World Space

        controls.unlock();
        camera.position.setZ(pano.position.z + 0.1);
        controls.target.copy(pano.position.clone());
        controls.lock();
      }
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
    /** Bounding rect for the canvas */
    const rect = renderer.domElement.getBoundingClientRect();

    /** Offset values for the canvas */
    const x = (event.clientX - rect.left) / renderer.domElement.clientWidth;
    const y = (event.clientY - rect.top) / renderer.domElement.clientHeight;

    /** calculate pointer position in normalized device coordinates (-1 to +1) */
    moveMouse.x = x * 2 - 1;
    moveMouse.y = -y * 2 + 1;
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

  const resizeRendererToDisplaySize = (root?: HTMLElement) => {
    if (root) {
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
    }
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
      <Toolbar onMouseMove={handleMouseMove} onClick={handleClick} />
    </Suspense>
  );
};

export default Tool;
