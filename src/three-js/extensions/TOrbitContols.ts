import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DEFAULT_DATA } from "../../data";

/**
 * This is a custom class that extends the three-js OrbitControls class.
 */
class TOrbitContols extends OrbitControls {
  /**
   * Sets the default values of OrbitControls for the application.
   * You can always change the default values by setting them individually on the class instance.
   * Example: `controls.enableDamping = true`.
   */
  public setDefaults() {
    /**
     * @param [enableDamping = true] is used to give a sense of weight to the controls.
     * An animation loop is required when either damping or auto-rotation are enabled
     * NOTE: that if this is enabled, you must call .update() in your animation loop.
     */
    this.enableDamping = true;
    this.dampingFactor = 0.05;
    this.screenSpacePanning = false;
    this.maxPolarAngle = Math.PI;
    this.rotateSpeed = -0.5;
    this.target.set(0, 0, 0);
    this.lock();
  }

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
    this.maxDistance = Infinity;
  }
}

export default TOrbitContols;
