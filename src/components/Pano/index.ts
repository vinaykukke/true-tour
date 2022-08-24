import * as THREE from "three";
// import { TPano } from "types/pano";

interface ILoaderProps {
  img: string;
  mesh: any;
}

/**
 * Create a new Hotspot and set its position in the scene
 * @param [img = string] Specify the image you want to be loaded.
 */
const geometry = new THREE.SphereBufferGeometry(200, 100, 50);

// const manager = new THREE.LoadingManager();

/**
 * Create a new Panoramic sphere and set its position in the scene
 * @param [img = string] Specify the image you want to be loaded.
 */
const Pano = () => {
  /** Pano Dome */
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.BackSide,
  });
  const mesh = new THREE.Mesh(geometry, material);

  /** Setting user data */
  mesh.name = "mesh__pano";
  mesh.userData = {
    type: "pano",
    active: false,
  };

  return mesh;
};

export const loader = (props: ILoaderProps) => {
  const { img, mesh } = props;
  /** Texture */
  const loader = new THREE.TextureLoader();
  loader.load(
    img,
    (texture) => {
      /** Cube map images */
      // Equirectangular to cube map
      // const texture = new THREE.CubeTextureLoader().load([
      //   "/px.jpg",
      //   "/nx.jpg",
      //   "/ny.jpg",
      //   "/py.jpg",
      //   "/pz.jpg",
      //   "/nz.jpg",
      // ]);
      // texture.flipY = true;

      /** This inverts the texture on the x axis */
      texture.wrapS = THREE.RepeatWrapping;
      texture.minFilter = THREE.NearestFilter;
      texture.repeat.set(-1, 1);
      /** Centers the texture to the center of the image */
      texture.offset.x = 0.25; // 0.0 - 1.0

      /** Once the texture has loaded, update the .map of the material */
      mesh.material.map = texture;
      mesh.material.needsUpdate = true;
    },
    undefined,
    (error) => {
      console.error("TEXTURE_LOADER_ERROR: ", error);
    }
  );
};

export default Pano;
