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
  type?: THotspotType;
  newHotspot?: boolean;
}
