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
import {
  faPlus,
  faTrash,
  faUpload,
  faImages,
} from "@fortawesome/free-solid-svg-icons";
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
import storage from "src/firebase";
import ImageRack from "src/components/ImageRack";

interface IProps {
  onMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const Toolbar = (props: IProps) => {
  const { selectedObj, previewMode } = useThree();
  const disable = !Boolean(selectedObj);
  const { setSelectedObj, togglePreviewMode } = useUpdate();
  const [showImageRack, toggleImageRack] = useState(false);
  // const [loading, setLoading] = useState(false);
  // const [success, setSuccess] = useState(false);
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
  const toggle = () => toggleImageRack((prev) => !prev);

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

  const onError = (reject) => (error: StorageError) => {
    // Handle unsuccessful uploads
    reject(new Error("Image upload failed!", { cause: error }));
    alert(`Upload Failed! Please check the console for more info.`);
  };

  const onSuccess = (uploadTask: UploadTask, resolve) => () => {
    resolve(getDownloadURL(uploadTask.snapshot.ref));
  };

  const handleUpload = async (e: React.ChangeEvent<any>) => {
    const imagesArray: File[] = Array.from(e.target.files);
    const promises = [];
    imagesArray.forEach((img) => {
      const imageRef = ref(storage, `images/${img.name}__${v4()}`);
      const uploadTask = uploadBytesResumable(imageRef, img);
      const promise = new Promise((resolve, reject) =>
        /**
         * Register three observers:
         * 1. 'state_changed' observer, called any time the state changes
         * 2. Error observer, called on failure
         * 3. Completion observer, called on successful completion
         */
        uploadTask.on(
          "state_changed",
          onProgress,
          onError(reject),
          onSuccess(uploadTask, resolve)
        )
      );
      promises.push(promise);
    });

    const urls = await Promise.all(promises);
    setUploadedImages((prev) => [...prev, ...urls]);
  };

  useEffect(() => {
    const imageListRef = ref(storage, "images/");
    const fetch = async () => {
      const res = await listAll(imageListRef);
      const promises = res.items.map(
        (item) =>
          new Promise<string>((resolve) => resolve(getDownloadURL(item)))
      );
      const urls = await Promise.all(promises);
      setUploadedImages(urls);
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
            {uploadedImages.length > 0 && (
              <IconButton
                className="image__gallery"
                aria-label="image gallery"
                onClick={toggle}
              >
                <FontAwesomeIcon icon={faImages} />
              </IconButton>
            )}
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
      {uploadedImages.length > 0 && showImageRack && (
        <ImageRack images={uploadedImages} />
      )}
    </Stack>
  );
};

export default Toolbar;
