import { Vector3 } from "three";

/** This is basically a circular linked list */
const store = [
  {
    name: "outside",
    color: "lightpink",
    position: new Vector3(10, 0, -15),
    url: "../public/pano_inside.jpg",
    link: 1,
  },
  {
    name: "inside",
    color: "lightblue",
    position: new Vector3(15, 0, 0),
    url: "../public/pano_outside.jpg",
    link: 0,
  },
  // ...
];

export default store;
