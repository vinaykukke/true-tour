import Pano, { loader } from "src/components/Pano";
import { DEFAULT_DATA } from "src/data";
import { moveCamera } from "./camera";

export const createScene = (targetScene: string) => {
  /** Get all the mesh */
  const num = scene.children.length;
  const pano = Pano();
  loader({ img: targetScene, mesh: pano });
  /** Set the position of the pano */
  pano.position.set(0, 0, DEFAULT_DATA.pano_radius * 5 * num);

  /** Add to scene */
  scene.add(pano); // World Space
  moveCamera(pano);
};

export const handleZoom = (event: React.WheelEvent<HTMLDivElement>) => {
  const zoom = camera.zoom;
  const zoomIn = event.deltaY < 0 && zoom <= DEFAULT_DATA.camera_zoom__max;
  const zoomOut = event.deltaY > 0 && zoom >= DEFAULT_DATA.camera_zoom__min;

  if (zoomIn) camera.zoom = zoom + 0.2;
  if (zoomOut) camera.zoom = zoom - 0.2;

  /** Update the projection matrix */
  camera.updateProjectionMatrix();
};

export const resizeRendererToDisplaySize = (root?: HTMLElement) => {
  if (root) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize =
      width !== root.clientWidth || height !== root.clientHeight;

    if (needResize) {
      renderer.setSize(root.clientWidth, root.clientHeight);
      labelRenderer.setSize(root.clientWidth, root.clientHeight);
    }

    return needResize;
  }
};
