import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const setup = () => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    90,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );

  camera.position.set(0, 0, 0.1);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);

  /**
   * @param [enableDamping = true] is used to give a sense of weight to the controls.
   * An animation loop is required when either damping or auto-rotation are enabled
   * NOTE: that if this is enabled, you must call .update() in your animation loop.
   */
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false;
  controls.minDistance = 10;
  controls.maxDistance = 1500;
  controls.maxPolarAngle = Math.PI;

  return { scene, camera, renderer, controls };
};

export default setup;
