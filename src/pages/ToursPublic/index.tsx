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
import { useUpdate } from "src/context/ThreejsContext";
import Pano, { loader } from "src/components/Pano";
import Hs from "src/components/Hs";
import { IDBHotspot } from "src/types/hotspot";
import { TPano } from "src/types/pano";
import { IDBScene } from "src/types/scene";
import { handleZoom, resizeRendererToDisplaySize } from "src/helpers/tool";
import Hotspot from "src/components/Hotspot";
import { DEFAULT_DATA } from "src/data";
import "./tools.styles.scss";

/** User Interaction */
let isUserInteracting = false;

/** User Interaction Event*/
const mouseMoveEndEvent = new Event("mouseMoveEnd");
let timeout: NodeJS.Timeout = null;

const Tool = () => {
  const params = useParams();
  const { setExecuteOnmobile } = useUpdate();
  const [hotspots, setHotspots] = useState<
    THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>[]
  >([]);
  const databaseRef = dbRef(
    db,
    `tours/sobha-developers/${params.id}/${params.tourId}`
  );
  const rootRef = useRef<HTMLDivElement>(null);

  const handlePointerOver = () => {
    if (!controls.enabled) controls.enable();
    setExecuteOnmobile(false);
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

    if (isUserInteracting) requestAnimationFrame(animate);
  }, []);

  const handleMouseMove = () => {
    if (!isUserInteracting) {
      isUserInteracting = true;
      animate();
    }

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(
      () => rootRef.current?.dispatchEvent(mouseMoveEndEvent),
      1000 * 10
    );
  };

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
        onWheel={handleZoom}
        onPointerMove={handleMouseMove}
        onPointerOver={handlePointerOver}
      />
      {hotspots.map((hs, i) => (
        <Hs mesh={hs} key={i} tabIndex={i} publishedMode />
      ))}
    </Suspense>
  );
};

export default Tool;
