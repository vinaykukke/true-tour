import React, { Suspense, useCallback, useEffect, useRef } from "react";
import * as THREE from "three";
import setup from "src/three-js/setup";
import { TPano } from "src/types/pano";
import Toolbar from "src/components/Toolbar";
import { useUpdate, useThree } from "src/context/ThreejsContext";
import {
  createScene,
  handleZoom,
  resizeRendererToDisplaySize,
} from "src/helpers/tool";
import "./tools.styles.scss";

/** User Interaction */
let isUserInteracting = false;

/** User Interaction Event*/
const mouseMoveEndEvent = new Event("mouseMoveEnd");
let timeout: NodeJS.Timeout = null;

/** Selected / Draggable objects */
let draggableObject: THREE.Object3D;

/** Vectors for mouse events */
const clickMouse = new THREE.Vector2();
const moveMouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

const Tool = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const { previewMode, activeScene } = useThree();
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
    const found = raycaster.intersectObjects<TPano>(scene.children);
    const obj = found.length > 0 && found[0].object;

    if (!previewMode && obj.userData.draggable) {
      if (doubleClick) draggableObject = obj;
      setSelectedObj(obj);
    }

    if (previewMode && obj.name === "mesh__hotspot") {
      const executable = obj.userData.executable;
      const targetScene = obj.userData.targetScene;
      const execute = executable && Boolean(targetScene);

      /** TODO: Please replace this implementation with the `ToursPublic` implementation */
      if (execute) createScene(targetScene);
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
    if (!isUserInteracting) {
      isUserInteracting = true;
      animate();
    }

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(
      () => rootRef.current?.dispatchEvent(mouseMoveEndEvent),
      1000 * 10
    );

    /** Bounding rect for the canvas */
    const rect = renderer.domElement.getBoundingClientRect();

    /** Offset values for the canvas */
    const x = (event.clientX - rect.left) / renderer.domElement.clientWidth;
    const y = (event.clientY - rect.top) / renderer.domElement.clientHeight;

    /** calculate pointer position in normalized device coordinates (-1 to +1) */
    moveMouse.x = x * 2 - 1;
    moveMouse.y = -y * 2 + 1;
  };

  const dragObject = () => {
    if (draggableObject) {
      /** Disable OrbitalControl if user is dragging object */
      controls.disable();

      /** Set the camera from which the ray should orginate and to what coordinates it should go to */
      raycaster.setFromCamera(moveMouse, camera);

      const found = raycaster.intersectObjects<TPano>(scene.children);

      if (found.length > 0) {
        found.forEach((item) => {
          /** If the intersected object is not a pano OR is a hotspot the skip it and move to next item */
          const skip =
            item.object.name !== "mesh__pano" || !item.object.userData?.active;

          if (skip) return;

          draggableObject.position.copy(item.point.clone());
          item.object.worldToLocal(draggableObject.position);
        });
      }

      /** Enable OrbitalControl once the dragging is finished */
      controls.enable();
    }
  };

  const animate = useCallback(() => {
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

    if (isUserInteracting) requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    /** Initial Setup */
    setup();

    /** User Interaction Event */
    rootRef.current.addEventListener(
      "mouseMoveEnd",
      () => (isUserInteracting = false)
    );

    /** Start the animation */
    isUserInteracting = true;
    animate();
  }, [animate]);

  return (
    <Suspense fallback={null}>
      <div
        ref={rootRef}
        id="three-js__root"
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onWheel={handleZoom}
      />
      {!activeScene && (
        <div className="default_message__no_active_scene">
          Please upload an image to get started.
        </div>
      )}
      <Toolbar onMouseMove={handleMouseMove} onClick={handleClick} />
    </Suspense>
  );
};

export default Tool;
