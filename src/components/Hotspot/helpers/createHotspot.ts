import * as THREE from "three";

let tabindex = 0;

export const createHotspotHTML = (
  mesh: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>
) => {
  /** Create label object */
  const hotspotEl = document.createElement("div");
  const labelEl = createLabelHTML();
  const tooltipEl = createTooltipHTML();

  hotspotEl.className = "hotspot";
  hotspotEl.dataset.uuid = mesh.uuid;
  hotspotEl.dataset.type = mesh.userData.type;
  hotspotEl.id = `hotspot__${mesh.uuid}`;
  hotspotEl.tabIndex = tabindex++;

  hotspotEl.append(labelEl, tooltipEl);

  return hotspotEl;
};

const createLabelHTML = () => {
  const labelEl = document.createElement("div");
  labelEl.className = "hotspot__label";
  labelEl.textContent = "outside";

  return labelEl;
};

const createTooltipHTML = () => {
  const tooltipEl = document.createElement("span");
  tooltipEl.className = "tooltiptext";
  tooltipEl.textContent = "Tooltip Text";

  return tooltipEl;
};
