import { Suspense, useEffect, useRef } from "react";
import setup from "./three-js/setup";
// import store from "data/store";
import getPano from "./mesh/geometry/pano";
import Hotspot from "./mesh/geometry/hotspot";
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
    const hotspot = new Hotspot(60, 0, -195);
    hotspot.addLabel(labelRef, "outside");
    const hotspotMesh = hotspot.getMesh();

    /** Add to scene */
    scene.add(pano, hotspotMesh);

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
