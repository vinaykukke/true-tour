import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import IconButton from "@mui/material/IconButton";
import Hotspot from "src/components/Hotspot";
import { removeHotspot } from "src/helpers/dispose";
import { THotspotType } from "src/types/hotspot";
import { getScreenCenter } from "src/helpers/screenCenter";
import { useThree, useUpdate } from "src/context";
import Hs from "src/components/Hs";

const Tools = (props) => {
  const threeCxt = useThree();
  const { setSelectedObj } = useUpdate();
  const [hotspots, setHotspots] = useState([]);

  const addHotspot = (type: THotspotType) => () => {
    /** https://stackoverflow.com/questions/11036106/three-js-projector-and-ray-objects */
    const center = getScreenCenter();
    const pano = scene.getObjectByName("mesh__pano");
    const hs = Hotspot({ type, newHotspot: true });

    if (center) hs.position.copy(center.clone());

    setHotspots((prev) => [...prev, hs]);
    setSelectedObj(hs);

    /** Converting to the pano's local system before adding it to the scene */
    pano.worldToLocal(hs.position);
    pano.add(hs);
  };

  const deleteHotspot = () => {
    /** Remove the selected object from the scene */
    const { selectedObj } = threeCxt;
    /** Remove the selected object from the scene */
    if (selectedObj) {
      selectedObj.parent.remove(selectedObj);
      removeHotspot(selectedObj);
      setSelectedObj(null);
    }
  };

  return (
    <div className="toolbar">
      <IconButton
        className="hotspot__add"
        aria-label="add"
        onClick={addHotspot("right")}
      >
        <AddIcon />
      </IconButton>
      <IconButton
        className="hotspot__delete"
        aria-label="add"
        onClick={deleteHotspot}
      >
        <DeleteForeverRoundedIcon />
      </IconButton>
      {hotspots.map((hs, i) => (
        <Hs onMouseMove={props.onMouseMove} mesh={hs} key={i} tabIndex={i} />
      ))}
    </div>
  );
};

export default Tools;
