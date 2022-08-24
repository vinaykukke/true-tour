import { Vector3 } from "three";

export type THotspotType = "left" | "right" | "up" | "down" | "info";

export interface IHotspotProps {
  type?: THotspotType;
  newHotspot?: boolean;
  execution?: Vector3;
}

export interface IDBHotspot {
  id: number;
  meshId: number;
  position: { x: number; y: number; z: number };
  userData: {
    draggable: boolean;
    executable: boolean;
    sceneName: string;
    targetScene: string;
    name: string;
    type: THotspotType;
  };
  uuid: string;
}
