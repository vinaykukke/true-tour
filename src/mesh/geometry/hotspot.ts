import * as THREE from "three";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";

interface IHotspotProps {
  x?: number;
  y?: number;
  z?: number;
  color?: THREE.ColorRepresentation;
}

/**
 * Create a new Hotspot and set its position in the scene
 * @param [x = number] x Posotion. Default is 0
 * @param [y = number] y Position. Default is 0
 * @param [z = number] z Position. Default is 0
 * @param [color = THREE.ColorRepresentation] Specify the color of the hotspot. Default is "lightpink"
 */

const Hotspot = (props: IHotspotProps) => {
  const { x = 0, y = 0, z = 0, color = "lightpink" } = props;

  /** Hotspot */
  const geometry = new THREE.SphereGeometry(8, 32, 32);
  const material = new THREE.MeshBasicMaterial({ color: color });

  /** Create mesh */
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  mesh.userData = { type: "hotspot", name: `hotspot_uuid__${mesh.uuid}` };
  mesh.visible = false;

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
