import { Suspense } from "react";
import * as THREE from "three";
import setup from "./three-js/setup";
// import store from "./data/store";
import "./App.scss";

function App() {
  /** Initial setup */
  const { scene, camera, renderer, controls } = setup();

  /** Texture */
  const loader = new THREE.TextureLoader();
  const texture = loader.load("/pano_inside.jpg");

  /** Pano Dome */
  const geometry = new THREE.SphereBufferGeometry(2000, 100, 50);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    color: 0xffff00,
    side: THREE.BackSide,
  });
  const pano = new THREE.Mesh(geometry, material);

  /** Add to scene */
  scene.add(pano);

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
