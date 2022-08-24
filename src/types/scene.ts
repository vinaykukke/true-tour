import { IDBHotspot } from "./hotspot";

export interface IDBScene {
  fullPath: string;
  hotspots: IDBHotspot[];
  meshId: number;
  id: number;
  position: { x: number; y: number; z: number };
  uuid: string;
  sceneId: string;
}
