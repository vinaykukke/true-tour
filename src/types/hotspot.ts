import { Vector3 } from "three";

export type THotspotType = "left" | "right" | "up" | "down";

export interface IHotspotProps {
  type?: THotspotType;
  newHotspot?: boolean;
  execution?: Vector3;
}
