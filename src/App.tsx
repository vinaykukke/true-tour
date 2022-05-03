import { Suspense, useEffect, useRef } from "react";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import setup from "./three-js/setup";
// import store from "data/store";
import getPano from "./mesh/geometry/pano";
import getHotspot from "./mesh/geometry/hotspot";
import "./App.scss";

function App() {
  const threejsMountPoint = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /** Initial setup */
    const { scene, camera, renderer, controls, labelRenderer } =
      setup(threejsMountPoint);

    /** Get all the mesh */
    const pano = getPano();
    const hotspot = getHotspot();

    /** Crate label object */
    const label = new CSS2DObject(labelRef.current);
    labelRef.current.textContent = "outside";
    label.position.set(0, 0, 0);

    /** Adding the label to the Hotspot mesh */
    hotspot.add(label);

    /** Add to scene */
    scene.add(pano, hotspot);

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
      <div id="three-js__root" ref={threejsMountPoint} />
      <div id="label" ref={labelRef} />
    </Suspense>
  );
}

export default App;
