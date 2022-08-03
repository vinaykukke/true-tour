import React, { useEffect, useState } from "react";
import { Mesh, MeshBasicMaterial, SphereGeometry } from "three";
import {
  getDownloadURL,
  listAll,
  ref,
  StorageError,
  uploadBytesResumable,
  UploadTask,
  UploadTaskSnapshot,
} from "firebase/storage";
import { v4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faUpload } from "@fortawesome/free-solid-svg-icons";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import ListSubheader from "@mui/material/ListSubheader";
import Hotspot from "src/components/Hotspot";
import { removeHotspot } from "src/helpers/dispose";
import { THotspotType } from "src/types/hotspot";
import { getScreenCenter } from "src/helpers/screenCenter";
import { useThree, useUpdate } from "src/context";
import Hs from "src/components/Hs";
import Type from "src/components/Type";
// import ImageRack from "src/components/ImageRack";
import storage from "src/firebase";

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
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

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

  const onProgress = (snapshot: UploadTaskSnapshot) => {
    /**
     * Observe state change events such as progress, pause, and resume
     * Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
     */
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log("Upload is " + progress + "% done");
    switch (snapshot.state) {
      case "paused":
        console.log("Upload is paused");
        break;
      case "running":
        console.log("Upload is running");
        break;
    }
  };

  const onError = (error: StorageError) => {
    // Handle unsuccessful uploads
    console.error("Image upload failed!", error);
    alert(`Upload Failed! Please check the console for more info.`);
  };

  const onSuccess = (uploadTask: UploadTask) => async () => {
    const url = await getDownloadURL(uploadTask.snapshot.ref);
    setUploadedImages((prev) => [...prev, url]);
    console.log("File available at", url);
  };

  const handleUpload = (e: React.ChangeEvent<any>) => {
    const imagesArray: File[] = Array.from(e.target.files);
    imagesArray.forEach(async (img) => {
      const imageRef = ref(storage, `images/${img.name}__${v4()}`);
      const uploadTask = uploadBytesResumable(imageRef, img);

      /**
       * Register three observers:
       * 1. 'state_changed' observer, called any time the state changes
       * 2. Error observer, called on failure
       * 3. Completion observer, called on successful completion
       */
      uploadTask.on(
        "state_changed",
        onProgress,
        onError,
        onSuccess(uploadTask)
      );
    });
  };

  const renderImages = (item: string, i: number) => {
    return (
      <ImageListItem key={i}>
        <img
          src={`${item}?w=248&fit=crop&auto=format`}
          srcSet={`${item}?w=248&fit=crop&auto=format&dpr=2 2x`}
          alt={`panorama ${i}`}
          loading="lazy"
        />
        <ImageListItemBar title="picture" subtitle="Demo Images" />
      </ImageListItem>
    );
  };

  useEffect(() => {
    const imageListRef = ref(storage, "images/");
    const fetch = async () => {
      const res = await listAll(imageListRef);
      res.items.forEach(async (item) => {
        const url = await getDownloadURL(item);
        setUploadedImages((prev) => [...prev, url]);
      });
    };
    fetch();
  }, []);

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
              aria-label="delete"
              color="error"
              onClick={deleteHotspot}
            >
              <FontAwesomeIcon icon={faTrash} />
            </IconButton>
            <IconButton
              className="upload__image"
              aria-label="upload picture"
              component="label"
              onChange={handleUpload}
            >
              <input hidden multiple accept="image/*" type="file" />
              <FontAwesomeIcon icon={faUpload} />
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
      {uploadedImages.length > 0 && (
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <ImageList sx={{ width: 500, height: 450 }}>
            <ImageListItem key="Subheader" cols={2}>
              <ListSubheader component="div">Uploaded Images</ListSubheader>
            </ImageListItem>
            {uploadedImages.map(renderImages)}
          </ImageList>
        </Stack>
      )}
      {hotspots.map((hs, i) => (
        <Hs onMouseMove={props.onMouseMove} mesh={hs} key={i} tabIndex={i} />
      ))}
      {/* <ImageRack /> */}
    </Stack>
  );
};

export default Toolbar;
