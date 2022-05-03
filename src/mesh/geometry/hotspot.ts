import React from "react";
import * as THREE from "three";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";
class Hotspot {
  private x: number;
  private y: number;
  private z: number;
  private color: THREE.ColorRepresentation;
  private mesh: THREE.Mesh;

  /**
   * Create a new Hotspot and set its position in the scene
   * @param [x = number] x Posotion. Default is 0
   * @param [y = number] y Position. Default is 0
   * @param [z = number] z Position. Default is 0
   * @param [color = THREE.ColorRepresentation] Specify the color of the hotspot. Default is "lightpink"
   */
  constructor(
    x: number = 0,
    y: number = 0,
    z: number = 0,
    color: THREE.ColorRepresentation = "lightpink"
  ) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.color = color;

    /** Pano Dome */
    const geometry = new THREE.SphereGeometry(8, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: this.color });

    this.mesh = new THREE.Mesh(geometry, material);
    this.setPosition();
  }

  public addLabel(
    ref: React.MutableRefObject<HTMLElement>,
    text: string = "Default"
  ) {
    /** Crate label object */
    const label = new CSS2DObject(ref.current);
    ref.current.textContent = text;

    /** Adding the label to the Hotspot mesh */
    this.mesh.add(label);
    label.position.set(0, 0, 0);
  }

  private setPosition() {
    this.mesh.position.set(this.x, this.y, this.z);
    this.mesh.layers.enableAll();
  }

  public getPosition() {
    return this.mesh.position;
  }

  public getMesh() {
    return this.mesh;
  }
}

export default Hotspot;
