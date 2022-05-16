import * as THREE from "three";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";
import { VRButton } from "three/examples/jsm/webxr/VRButton";
import TOrbitContols from "./extensions/TOrbitContols";
import { DEFAULT_DATA } from "../data";

/** GLOBAL THREE JS VARIABLES */
declare global {
  var scene: THREE.Scene;
  var camera: THREE.Camera;
  var renderer: THREE.WebGLRenderer;
  var controls: TOrbitContols;
  var labelRenderer: CSS2DRenderer;
}

const setup = () => {
  const mountPoint = document.getElementById("three-js__root");
  global.scene = new THREE.Scene();
  global.camera = new THREE.PerspectiveCamera(
    DEFAULT_DATA.camera_fov,
    window.innerWidth / window.innerHeight,
    DEFAULT_DATA.camera_near,
    DEFAULT_DATA.camera_far
  );

  global.camera.position.set(0, 0, 0.1);

  global.renderer = new THREE.WebGLRenderer({ antialias: true });
  global.renderer.setSize(window.innerWidth, window.innerHeight);
  global.renderer.setPixelRatio(window.devicePixelRatio);

  /** Mount Point for Three-js */
  mountPoint.appendChild(renderer.domElement);

  global.labelRenderer = new CSS2DRenderer();
  global.labelRenderer.setSize(window.innerWidth, window.innerHeight);
  global.labelRenderer.domElement.style.position = "absolute";
  global.labelRenderer.domElement.style.top = "0px";

  /** Append the label element to the three-js mount point */
  mountPoint.appendChild(labelRenderer.domElement);

  global.controls = new TOrbitContols(camera, labelRenderer.domElement);
  global.controls.setDefaults();

  /** Enabling VR */
  document.body.appendChild(VRButton.createButton(renderer));
  renderer.xr.enabled = true;
};

export default setup;
