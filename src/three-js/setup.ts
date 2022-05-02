import { MutableRefObject } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer.js";

const setup = (mountPoint: MutableRefObject<any>) => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    65,
    window.innerWidth / window.innerHeight,
    1,
    500
  );

  camera.position.set(0, 0, 0.1);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  const labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.domElement.style.position = "absolute";
  labelRenderer.domElement.style.top = "0px";

  /** Append the label element to the three-js mount point */
  mountPoint.current.appendChild(labelRenderer.domElement);

  const controls = new OrbitControls(camera, labelRenderer.domElement);

  /**
   * @param [enableDamping = true] is used to give a sense of weight to the controls.
   * An animation loop is required when either damping or auto-rotation are enabled
   * NOTE: that if this is enabled, you must call .update() in your animation loop.
   */
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false;
  controls.minDistance = 10;
  controls.maxDistance = 50;
  controls.maxPolarAngle = Math.PI;
  controls.target.set(0, 0, 0);

  return { scene, camera, renderer, controls, labelRenderer };
};

export default setup;
