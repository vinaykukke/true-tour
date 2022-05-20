import * as THREE from "three";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";

interface IHotspotProps {
  x?: number;
  y?: number;
  z?: number;
}

/**
 * Create a new Hotspot and set its position in the scene
 * @param [x = number] x Posotion. Default is 0
 * @param [y = number] y Position. Default is 0
 * @param [z = number] z Position. Default is -195
 */
const Hotspot = (props?: IHotspotProps) => {
  /** Default position for new hotspot */
  let x = 0;
  let y = 0;
  let z = -195;

  /** If positon values are give, use them */
  if (props && Object.keys(props).length > 0) {
    x = props.x;
    y = props.y;
    z = props.z;
  }

  /** Hotspot */
  const geometry = new THREE.SphereGeometry(8, 32, 32);
  const material = new THREE.MeshBasicMaterial();

  /** Create mesh */
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  mesh.userData = {
    type: "hotspot",
    name: `hotspot_uuid__${mesh.uuid}`,
    draggable: true,
  };
  mesh.visible = false;
  mesh.name = "mesh__hotspot";

  /** Create label object */
  const hotspotEl = document.createElement("div");
  const labelEl = document.createElement("div");
  const tooltipEl = document.createElement("span");
  hotspotEl.className = "hotspot";
  hotspotEl.id = `hotspot__${mesh.uuid}`;
  labelEl.className = "hotspot__label";
  labelEl.textContent = "outside";
  tooltipEl.className = "tooltiptext";
  tooltipEl.textContent = "Tooltip Text";

  hotspotEl.append(labelEl, tooltipEl);

  const label = new CSS2DObject(hotspotEl);

  /** Adding the label to the Hotspot mesh */
  mesh.add(label);
  label.position.set(0, 0, 0); // Local space OR Object space

  return mesh;
};

export default Hotspot;
