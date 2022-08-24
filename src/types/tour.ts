import { IDBScene } from "./scene";

export interface IDBTour {
  name: string;
  scenes: IDBScene[];
  status: "Published" | "Draft";
}
