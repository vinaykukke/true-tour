import { Suspense } from "react";
import setup from "./three-js/setup";
// import store from "./data/store";
import getPano from "./mesh/geometry/pano";
import getHotspot from "./mesh/geometry/hotspot";
import "./App.scss";

/** Initial setup */
const { scene, camera, renderer, controls } = setup();

/** Get all the mesh */
const pano = getPano();
const hotspot = getHotspot();

/** Add to scene */
scene.add(pano, hotspot);

function animate() {
  requestAnimationFrame(animate);

  /** Only required if controls.enableDamping = true, or if controls.autoRotate = true */
  controls.update();

  renderer.render(scene, camera);
  return null;
}

function App() {
  return (
    <div className="App">
      <Suspense fallback={null}>{animate()}</Suspense>
    </div>
  );
}

export default App;
