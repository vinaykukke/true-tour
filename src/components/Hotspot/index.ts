import * as THREE from "three";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { createHotspotHTML } from "./helpers/createHotspot";
import { IHotspotProps, THotspotType } from "src/types/hotspot";

/**
 * Create a new Hotspot and set its position in the scene
 * @param [x = number] x Posotion. Default is 0
 * @param [y = number] y Position. Default is 0
 * @param [z = number] z Position. Default is -195
 */
const Hotspot = (props?: IHotspotProps) => {
  /** Default position for new hotspot */
  let x: number = 0;
  let y: number = 0;
  let z: number = -195;
  let type: THotspotType = "default";

  /** If positon values are give, use them */
  if (props && Object.keys(props).length > 0) {
    x = props.x ? props.x : x;
    y = props.y ? props.y : y;
    z = props.z ? props.z : z;
    type = props.type ? props.type : type;
  }

  /** Hotspot */
  const geometry = new THREE.SphereGeometry(10, 32, 32);
  const material = new THREE.MeshBasicMaterial();

  /** Create mesh */
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  mesh.userData = {
    type: "hotspot",
    varient: type,
    name: `hotspot_uuid__${mesh.uuid}`,
    draggable: true,
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
  document.getElementById(`hotspot__${object.uuid}`).remove();
};

export default Hotspot;
