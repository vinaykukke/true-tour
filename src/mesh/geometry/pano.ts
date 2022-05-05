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
  mesh.userData = { type: "pano", name: `pano_uuid__${mesh.uuid}` };

  /** Set the position of the mesh */
  mesh.position.set(x, y, z);

  return mesh;
};

export default Pano;
