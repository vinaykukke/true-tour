import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DEFAULT_DATA } from "../../data";

/**
 * This is a custom class that extends the three-js OrbitControls class.
 */
class TOrbitContols extends OrbitControls {
  /**
   * Locks the Orbit Controls to the specified values.
   * @param [min = number] Min navigable diatance. Default is 10
   * @param [max = number] Max navigable diatance. Default is 50
   */
  public lock(
    min: number = DEFAULT_DATA.control_lock__min,
    max: number = DEFAULT_DATA.control_lock__max
  ) {
    this.minDistance = min;
    this.maxDistance = max;
  }

  /**
   * Unlocks the Orbit Controls, allowing the camera to move about the scene.
   */
  public unlock() {
    this.minDistance = 0;
    this.maxDistance = 0;
  }
}

export default TOrbitContols;
