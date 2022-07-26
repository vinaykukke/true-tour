import React, { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import setup from "./three-js/setup";
import Pano from "./components/Pano";
import Hotspot from "./components/Hotspot";
import { removeHotspot } from "./components/Hotspot";
import { THotspotType } from "./types/hotspot";
import { DEFAULT_DATA } from "./data";
import "./App.scss";

/** Selected / Draggable objects */
let draggableObject: THREE.Object3D;
let selectedObject: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;

/** Vectors for mouse events */
const clickMouse = new THREE.Vector2();
const moveMouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

function App() {
  const rootRef = useRef(null);

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
      selectedObject = obj;
    }

    /** Clear selectedObject once focus is shifted from hotspot */
    if (obj.name === "mesh__pano") selectedObject = null;

    /** Removes the focus of newly added hotspot */
    const hs = document.getElementsByClassName("hotspot_new__focus");
    for (let i = 0; i < hs.length; i++) {
      const element = hs[i];
      element.classList.remove("hotspot_new__focus");
      selectedObject = null;
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
          if (item.object.userData.type !== "pano") return;

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

  const addHotspot = (type?: THotspotType) => () => {
    /** https://stackoverflow.com/questions/11036106/three-js-projector-and-ray-objects */
    const screenCentre = new THREE.Vector3(0, 0, 0.5);
    const pano = scene.getObjectByName("mesh__pano");
    const hs = Hotspot({ type, newHotspot: true });

    screenCentre.unproject(camera).sub(camera.position).normalize();
    const ray = new THREE.Raycaster(camera.position, screenCentre);

    const found = ray.intersectObject(pano);
    const obj = found.length > 0 && found[0];

    if (obj) hs.position.copy(obj.point.clone());

    selectedObject = hs;

    pano.add(hs);
  };

  const deleteHotspot = () => {
    /** Remove the selected object from the scene */
    if (selectedObject) {
      selectedObject.parent?.remove(selectedObject);
      removeHotspot(selectedObject);
    }
    if (selectedObject?.userData.varient === "editRequest") editReqindex--;
  };

  return (
    <Suspense fallback={null}>
      <div
        ref={rootRef}
        id="three-js__root"
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onWheel={handleZoom}
      />
      <div className="hotspot__add" onClick={addHotspot()}>
        Add Hotspot
      </div>
      <div className="hotspot__delete" onClick={deleteHotspot}>
        Delete Hotspot
      </div>
      <div className="add__editRequest" onClick={addHotspot("editRequest")}>
        Add Edit Request
      </div>
    </Suspense>
  );
}

export default App;
