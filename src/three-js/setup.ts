import { MutableRefObject } from "react";
import * as THREE from "three";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";
import TOrbitContols from "./extensions/TOrbitContols";
import { DEFAULT_DATA } from "../data";

const setup = (mountPoint: MutableRefObject<HTMLElement>) => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    DEFAULT_DATA.camera_fov,
    window.innerWidth / window.innerHeight,
    DEFAULT_DATA.camera_near,
    DEFAULT_DATA.camera_far
  );

  camera.position.set(0, 0, 0.1);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  /** Mount Point for Three-js */
  mountPoint.current.appendChild(renderer.domElement);

  const labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.domElement.style.position = "absolute";
  labelRenderer.domElement.style.top = "0px";

  /** Append the label element to the three-js mount point */
  mountPoint.current.appendChild(labelRenderer.domElement);

  const controls = new TOrbitContols(camera, labelRenderer.domElement);

  /**
   * @param [enableDamping = true] is used to give a sense of weight to the controls.
   * An animation loop is required when either damping or auto-rotation are enabled
   * NOTE: that if this is enabled, you must call .update() in your animation loop.
   */
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false;
  controls.lock();
  controls.maxPolarAngle = Math.PI;
  controls.target.set(0, 0, 0);

  return { scene, camera, renderer, controls, labelRenderer };
};

export default setup;
