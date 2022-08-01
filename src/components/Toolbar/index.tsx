import React, { useState } from "react";
import { Mesh, MeshBasicMaterial, SphereGeometry } from "three";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Hotspot from "src/components/Hotspot";
import { removeHotspot } from "src/helpers/dispose";
import { THotspotType } from "src/types/hotspot";
import { getScreenCenter } from "src/helpers/screenCenter";
import { useThree, useUpdate } from "src/context";
import Hs from "src/components/Hs";
import Type from "src/components/Type";

interface IProps {
  onMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const Toolbar = (props: IProps) => {
  const { selectedObj, previewMode } = useThree();
  const disable = !Boolean(selectedObj);
  const { setSelectedObj, togglePreviewMode } = useUpdate();
  const [hotspots, setHotspots] = useState<
    Mesh<SphereGeometry, MeshBasicMaterial>[]
  >([]);

  const addHotspot = (type?: THotspotType) => () => {
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
      const copy = Array.from(hotspots);
      selectedObj.parent.remove(selectedObj);
      removeHotspot(selectedObj);
      setHotspots(copy.filter((hs) => hs.uuid !== selectedObj.uuid));
      setSelectedObj(null);
    }
  };

  const togglePreview = () => togglePreviewMode((prev) => !prev);

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      className={previewMode ? "toolbar toolbar__preview" : "toolbar"}
    >
      {!previewMode && (
        <>
          <Stack direction="row" spacing={1}>
            <IconButton
              className="hotspot__add"
              aria-label="add"
              color="primary"
              onClick={addHotspot()}
            >
              <FontAwesomeIcon icon={faPlus} />
            </IconButton>
            <IconButton
              disabled={disable}
              className="hotspot__delete"
              aria-label="add"
              color="error"
              onClick={deleteHotspot}
            >
              <FontAwesomeIcon icon={faTrash} />
            </IconButton>
          </Stack>
          <Type />
        </>
      )}
      <Button size="large" aria-label="preview" onClick={togglePreview}>
        {previewMode ? "Exit" : "Preview"}
      </Button>
      {previewMode && (
        <Button size="large" aria-label="publish">
          Publish
        </Button>
      )}
      {hotspots.map((hs, i) => (
        <Hs onMouseMove={props.onMouseMove} mesh={hs} key={i} tabIndex={i} />
      ))}
    </Stack>
  );
};

export default Toolbar;
