export type THotspotType =
  | "default"
  | "image"
  | "video"
  | "audio"
  | "pdfIcon"
  | "urlIcon"
  | "comment"
  | "editRequest";

export interface IHotspotProps {
  x?: number;
  y?: number;
  z?: number;
  type?: THotspotType;
  newHotspot?: boolean;
}
