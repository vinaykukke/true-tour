import * as THREE from "three";
import { IHotspotProps } from "src/types/hotspot";

const EXECUTABLES = ["left", "right", "up", "down"];

/** Hotspot */
const geometry = new THREE.SphereGeometry(10, 32, 32);
const material = new THREE.MeshBasicMaterial();

/**
 * Create a new Hotspot and set its position in the scene
 * Hotspot is always in the center of the screen
 */
const Hotspot = (props?: IHotspotProps) => {
  const executable = EXECUTABLES.includes(props.type);
  const defaultExecution = { image: "", targetView: new THREE.Vector3() };

  /** Create mesh */
  const mesh = new THREE.Mesh(geometry, material);
  mesh.userData = {
    type: props.type || "right",
    name: `hotspot_uuid__${mesh.uuid}`,
    draggable: true,
    new: props.newHotspot ? true : false,
    executable,
    execution: props.execution ? props.execution : defaultExecution,
  };
  mesh.visible = false;
  mesh.name = "mesh__hotspot";

  return mesh;
};

export default Hotspot;
