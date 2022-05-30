import * as THREE from "three";

interface IPanoProps {
  img: string;
}

/**
 * Create a new Hotspot and set its position in the scene
 * @param [img = string] Specify the image you want to be loaded.
 */
const Pano = (props: IPanoProps) => {
  const frustum = new THREE.Frustum();
  const { img } = props;
  /** Texture */
  const loader = new THREE.TextureLoader();
  const texture = loader.load(img);
  /** This inverts the texture on the x axis */
  texture.wrapS = THREE.RepeatWrapping;
  texture.repeat.x = -1;
  /** Centers the texture to the center of the image */
  texture.offset.x = 0.25; // 0.0 - 1.0

  /** Pano Dome */
  const geometry = new THREE.SphereBufferGeometry(200, 100, 50);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    color: 0xffffff,
    side: THREE.BackSide,
  });
  const mesh = new THREE.Mesh(geometry, material);

  /** Setting user data */
  mesh.name = "mesh__pano";
  mesh.userData = {
    type: "pano",
    inView: false,
    inFrustum: false,
  };

  mesh.onBeforeRender = () => {
    const matrix = new THREE.Matrix4().multiplyMatrices(
      camera.projectionMatrix,
      camera.matrixWorldInverse
    );
    /** Mesh is inView */
    mesh.userData.inView = true;

    frustum.setFromProjectionMatrix(matrix);
    /** Indicates if the Mesh is in the scene but outside of the camera furstum */
    mesh.userData.inFrustum = frustum.containsPoint(mesh.position);
  };

  return mesh;
};

export default Pano;
