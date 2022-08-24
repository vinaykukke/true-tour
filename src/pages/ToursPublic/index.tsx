/* eslint-disable */
import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import { useParams } from "react-router-dom";
import {
  getDownloadURL,
  ref,
  getMetadata,
  FullMetadata,
} from "firebase/storage";
import { ref as dbRef, get } from "firebase/database";
import { db, storage } from "src/firebase";
import setup from "src/three-js/setup";
import Pano, { loader } from "src/components/Pano";
import Hs from "src/components/Hs";
import { IDBHotspot } from "src/types/hotspot";
import { TPano } from "src/types/pano";
import { IDBScene } from "src/types/scene";
import { moveCamera } from "src/helpers/camera";
import { handleZoom, resizeRendererToDisplaySize } from "src/helpers/tool";
import Hotspot from "src/components/Hotspot";
import { DEFAULT_DATA } from "src/data";
import "./tools.styles.scss";

/** User Interaction */
let isUserInteracting = false;

/** Vectors for mouse events */
const clickMouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

const Tool = () => {
  const params = useParams();
  const [hotspots, setHotspots] = useState<
    THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>[]
  >([]);
  const databaseRef = dbRef(
    db,
    `tours/sobha-developers/${params.id}/${params.tourId}`
  );
  const rootRef = useRef<HTMLDivElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    /** Bounding rect for the canvas */
    const rect = renderer.domElement.getBoundingClientRect();

    /** Offset values for the canvas */
    const x = (event.clientX - rect.left) / renderer.domElement.clientWidth;
    const y = (event.clientY - rect.top) / renderer.domElement.clientHeight;

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

    if (obj.name === "mesh__hotspot") {
      const executable = obj.userData.executable;
      const targetSceneUrl = obj.userData.targetScene;
      const execute = executable && Boolean(targetSceneUrl);

      if (execute) {
        /** Always assuming that the taret scene has been added to the threejs scene */
        const uuid = obj.userData.sceneId;
        const targetScene = getTargetScene(uuid);
        moveCamera(targetScene);
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
    }
  };

  const getTargetScene = useCallback(
    (id: string) => scene.children.find((sc) => sc.userData.sceneId === id),
    []
  );

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

    if (isUserInteracting) requestAnimationFrame(animate);
  }, []);

  const addHotspots = (pano: TPano) => (hspt: IDBHotspot) => {
    const hs = Hotspot({ type: hspt.userData.type });
    hs.position.set(hspt.position.x, hspt.position.y, hspt.position.z);
    hs.userData = hspt.userData;

    setHotspots((prev) => [...prev, hs]);

    /** Converting to the pano's local system before adding it to the scene */
    pano.worldToLocal(hs.position);
    pano.add(hs);
  };

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

  useEffect(() => {
    const fetch = async () => {
      const res = await get(databaseRef);

      if (res.exists()) {
        const dbScenes: IDBScene[] = res.val().scenes;
        dbScenes.forEach(async (sc, i) => {
          const num = scene.children.length === 0 ? i : scene.children.length;
          const imageRef = ref(storage, sc.fullPath);
          const url = await getDownloadURL(imageRef);
          const metaData: FullMetadata = await getMetadata(imageRef);
          const shouldAddHotspots = sc && sc.hotspots && sc.hotspots.length > 0;
          /** Get all the mesh */
          const pano = Pano();

          /** Set the position of the pano */
          pano.position.set(0, 0, DEFAULT_DATA.pano_radius * 5 * num);
          loader({ img: url, mesh: pano });

          /** Setting fullPath */
          pano.userData.fullPath = sc.fullPath;
          pano.userData.sceneId = metaData.customMetadata.uuid;

          if (shouldAddHotspots) sc.hotspots.forEach(addHotspots(pano));

          /** Add to scene */
          scene.add(pano); // World Space
        });
      }
    };
    fetch();
  }, []);

  return (
    <Suspense fallback={null}>
      <div
        ref={rootRef}
        id="three-js__root"
        onClick={handleClick}
        onWheel={handleZoom}
      />
      {hotspots.map((hs, i) => (
        <Hs
          onClick={handleClick}
          mesh={hs}
          key={i}
          tabIndex={i}
          publishedMode
        />
      ))}
    </Suspense>
  );
};

export default Tool;
