import { Suspense } from "react";
import * as THREE from "three";
import setup from "./three-js/setup";
import "./App.scss";

function App() {
  /** Initial setup */
  const { scene, camera, renderer, controls } = setup();

  /** Materials */
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({
    wireframe: true,
    color: 0x00ff00,
  });
  const cube = new THREE.Mesh(geometry, material);

  /** Add to scene */
  scene.add(cube);

  function animate() {
    requestAnimationFrame(animate);

    /** Only required if controls.enableDamping = true, or if controls.autoRotate = true */
    controls.update();

    renderer.render(scene, camera);
    return null;
  }

  return (
    <div className="App">
      <Suspense fallback={null}>{animate()}</Suspense>
    </div>
  );
}

export default App;
