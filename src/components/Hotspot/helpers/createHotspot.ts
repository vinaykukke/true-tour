import * as THREE from "three";
import createTooltipHTML from "./createTooltip";
import { THotspotType } from "../../../types/hotspot";

let tabindex = 0;

export const createHotspotHTML = (
  mesh: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>,
  type?: THotspotType
) => {
  /** Create label object */
  const hotspotEl = document.createElement("div");
  const labelEl = createLabelHTML(type);
  const tooltipEl = createTooltipHTML(type);

  hotspotEl.classList.add("hotspot");
  if (mesh.userData.new) hotspotEl.classList.add("hotspot_new__focus");

  hotspotEl.dataset.uuid = mesh.uuid;
  hotspotEl.dataset.type = mesh.userData.type;
  hotspotEl.id = `hotspot__${mesh.uuid}`;
  hotspotEl.tabIndex = tabindex++;

  hotspotEl.append(labelEl, tooltipEl);

  return hotspotEl;
};

const createLabelHTML = (type?: THotspotType) => {
  const labelEl = document.createElement("div");
  labelEl.className = "hotspot__label";
  labelEl.textContent = "outside";

  if (type === "editRequest") labelEl.textContent = String(++editReqindex);

  return labelEl;
};
