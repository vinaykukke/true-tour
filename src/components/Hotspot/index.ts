import * as THREE from "three";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { createHotspotHTML } from "./helpers/createHotspot";
import { IHotspotProps, THotspotType } from "src/types/hotspot";

/**
 * Create a new Hotspot and set its position in the scene
 * Hotspot is always in the center of the screen
 */
const Hotspot = (props?: IHotspotProps) => {
  /** Default position for new hotspot */
  let type: THotspotType = "default";
  let newHotspot: boolean = false;

  /** If positon values are give, use them */
  if (props && Object.keys(props).length > 0) {
    type = props.type ? props.type : type;
    newHotspot = props.newHotspot ? props.newHotspot : newHotspot;
  }

  /** Hotspot */
  const geometry = new THREE.SphereGeometry(10, 32, 32);
  const material = new THREE.MeshBasicMaterial();

  /** Create mesh */
  const mesh = new THREE.Mesh(geometry, material);
  mesh.userData = {
    type: "hotspot",
    varient: type,
    name: `hotspot_uuid__${mesh.uuid}`,
    draggable: true,
    new: newHotspot ? true : false,
  };
  mesh.visible = false;
  mesh.name = "mesh__hotspot";

  /** Create label object */
  const hotspotEl = createHotspotHTML(mesh, type);

  const label = new CSS2DObject(hotspotEl);

  /** Adding the label to the Hotspot mesh */
  mesh.add(label);
  label.position.set(0, 0, 0); // Local space OR Object space

  return mesh;
};

export const removeHotspot = (
  object: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>
) => {
  /** Dispose the Material & Geometry */
  object.geometry.dispose();
  object.material.dispose();

  /** Remove the associated HTML node */
  const hs = document.getElementById(`hotspot__${object.uuid}`);
  hs && hs.remove();
};

export default Hotspot;
