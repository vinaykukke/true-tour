import { Mesh, SphereGeometry, MeshBasicMaterial } from "three";

export const removeHotspot = (
  object: Mesh<SphereGeometry, MeshBasicMaterial>
) => {
  if (object) {
    /** Dispose the Material & Geometry */
    object.geometry.dispose();
    object.material.dispose();

    /** Remove the associated HTML node */
    const hs = document.getElementById(`hotspot__${object.uuid}`);
    hs && hs.remove();
  }
};

export const clearScene = () => {
  const obj = scene.getObjectByName("mesh__pano");

  if (obj) {
    /** Remove any hotspots attached to the pano */
    if (obj.children.length > 0) {
      obj.children.forEach((item: Mesh<SphereGeometry, MeshBasicMaterial>) => {
        /** Dispose its Geometry & Material */
        item.material.dispose();
        item.geometry.dispose();

        /** Remove the pano from the scene */
        item.parent.remove(item);

        if (item.children.length > 0) {
          item.children.forEach(removeHotspot);
        }
      });
    }

    /** Reset OrbitControls */
    controls.reset();
  }
};
