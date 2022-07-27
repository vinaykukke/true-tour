import React, { useState } from "react";
import { Mesh, MeshBasicMaterial, SphereGeometry } from "three";
import AddIcon from "@mui/icons-material/Add";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import IconButton from "@mui/material/IconButton";
import Hotspot from "src/components/Hotspot";
import { removeHotspot } from "src/helpers/dispose";
import { THotspotType } from "src/types/hotspot";
import { getScreenCenter } from "src/helpers/screenCenter";
import { useThree, useUpdate } from "src/context";
import Hs from "src/components/Hs";
import Type from "src/components/Type";

const Tools = (props) => {
  const { selectedObj } = useThree();
  const disable = !Boolean(selectedObj);
  const { setSelectedObj } = useUpdate();
  const [hotspots, setHotspots] = useState<
    Mesh<SphereGeometry, MeshBasicMaterial>[]
  >([]);

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
    if (selectedObj) {
      selectedObj.parent.remove(selectedObj);
      setHotspots(hotspots.filter((hs) => hs.uuid !== selectedObj.uuid));
      removeHotspot(selectedObj);
      setSelectedObj(null);
    }
  };

  return (
    <div className="toolbar">
      <Stack direction="row" spacing={1}>
        <IconButton
          className="hotspot__add"
          aria-label="add"
          color="primary"
          onClick={addHotspot("right")}
        >
          <AddIcon />
        </IconButton>
        <IconButton
          disabled={disable}
          className="hotspot__delete"
          aria-label="add"
          color="error"
          onClick={deleteHotspot}
        >
          <DeleteForeverRoundedIcon />
        </IconButton>
      </Stack>
      <Type />
      <Button size="large" aria-label="publish">
        Publish
      </Button>
      {hotspots.map((hs, i) => (
        <Hs onMouseMove={props.onMouseMove} mesh={hs} key={i} tabIndex={i} />
      ))}
    </div>
  );
};

export default Tools;
