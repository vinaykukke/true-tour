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
  getMetadata,
  FullMetadata,
} from "firebase/storage";
import { v4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faUpload,
  faImages,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
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
import "./styles.scss";

interface IProps {
  onMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void;
}

interface IUploadedImage {
  metaData: FullMetadata;
  url: string;
}

const Toolbar = (props: IProps) => {
  const { selectedObj, previewMode } = useThree();
  const { setSelectedObj, togglePreviewMode } = useUpdate();
  const [showImageRack, toggleImageRack] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const icon = success ? faCheck : faUpload;
  const [hotspots, setHotspots] = useState<
    Mesh<SphereGeometry, MeshBasicMaterial>[]
  >([]);
  const [uploadedImages, setUploadedImages] = useState<IUploadedImage[]>([]);

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
      /**
       * Controls are disabled when the you hover the delete button.
       * Re-enable it once the hotspot is deleted.
       */
      controls.enable();
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
    if (progress === 100) console.log("Upload is " + progress + "% done");
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

  const onSuccess = (uploadTask: UploadTask, resolve) => async () => {
    resolve({
      url: await getDownloadURL(uploadTask.snapshot.ref),
      metaData: await getMetadata(uploadTask.snapshot.ref),
    });
  };

  const handleUpload = async (e: React.ChangeEvent<any>) => {
    const imagesArray: File[] = Array.from(e.target.files);
    const promises: Promise<IUploadedImage>[] = [];
    /** Show loading indicator */
    setLoading(true);

    imagesArray.forEach((img) => {
      const imageRef = ref(storage, `images/${img.name}__${v4()}`);
      const uploadTask = uploadBytesResumable(imageRef, img, {
        customMetadata: { name: img.name, title: "Hotel" },
      });
      const promise = new Promise<IUploadedImage>((resolve, reject) =>
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
    if (urls.length > 0) {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      setUploadedImages((prev) => [...prev, ...urls]);
    }
  };

  useEffect(() => {
    const imageListRef = ref(storage, "images/");
    const fetch = async () => {
      const res = await listAll(imageListRef);
      const promises = res.items.map(
        (item) =>
          new Promise<IUploadedImage>(async (resolve) =>
            resolve({
              url: await getDownloadURL(item),
              metaData: await getMetadata(item),
            })
          )
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
              className="upload__image"
              aria-label="upload picture"
              component="label"
              onChange={handleUpload}
            >
              <input hidden multiple accept="image/*" type="file" />
              <FontAwesomeIcon icon={icon} color={success ? "green" : ""} />
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
        <Hs
          onMouseMove={props.onMouseMove}
          deleteHotspot={deleteHotspot}
          mesh={hs}
          key={i}
          tabIndex={i}
          scenes={uploadedImages}
        />
      ))}
      {!previewMode && uploadedImages.length > 0 && showImageRack && (
        <ImageRack
          images={uploadedImages}
          setUploadedImages={setUploadedImages}
        />
      )}
      {loading && (
        <Box className="loading__indicator">
          <LinearProgress />
        </Box>
      )}
    </Stack>
  );
};

export default Toolbar;
