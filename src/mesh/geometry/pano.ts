import * as THREE from "three";

interface IPanoProps {
  x: number;
  y: number;
  z: number;
  img: string;
}

/**
 * Create a new Hotspot and set its position in the scene
 * @param [x = number] x Posotion. No Default. Required value.
 * @param [y = number] y Position. No Default. Required value.
 * @param [z = number] z Position. No Default. Required value.
 * @param [img = string] Specify the image you want to be loaded.
 */
const Pano = (props: IPanoProps) => {
  const { x, y, z, img } = props;
  /** Texture */
  const loader = new THREE.TextureLoader();
  const texture = loader.load(img);

  /** Pano Dome */
  const geometry = new THREE.SphereBufferGeometry(200, 100, 50);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    color: 0xffffff,
    side: THREE.BackSide,
  });
  const mesh = new THREE.Mesh(geometry, material);

  /** Setting user data */
  mesh.userData = {
    type: "pano",
    name: `pano_uuid__${mesh.uuid}`,
    inView: false,
    inFrustum: false,
  };

  mesh.onAfterRender = () => {
    /** Mesh is inView */
    mesh.userData.inView = true;

    const frustum = new THREE.Frustum();
    frustum.setFromProjectionMatrix(
      new THREE.Matrix4().multiplyMatrices(
        camera.projectionMatrix,
        camera.matrixWorldInverse
      )
    );
    /** Indicates if the Mesh is in the scene but outside of the camera furstum */
    mesh.userData.inFrustum = frustum.containsPoint(mesh.position);
  };

  /** Set the position of the mesh */
  mesh.position.set(x, y, z);

  return mesh;
};

export default Pano;
