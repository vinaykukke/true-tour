/* eslint-disable */
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
import { ref as dbRef, update, get } from "firebase/database";
import { useParams } from "react-router-dom";
import { db, storage } from "src/firebase";
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
import Divider from "@mui/material/Divider";
import Hotspot from "src/components/Hotspot";
import { removeHotspot } from "src/helpers/dispose";
import { THotspotType } from "src/types/hotspot";
import { getScreenCenter } from "src/helpers/screenCenter";
import { useThree, useUpdate } from "src/context/ThreejsContext";
import { useAuth } from "src/context/AuthContext";
import Hs from "src/components/Hs";
import Type from "src/components/Type";
import ImageRack from "src/components/ImageRack";
import PublishModal from "src/components/PublishModal";
import getSceneData from "src/helpers/dataProcessor";
import Pano, { loader } from "src/components/Pano";
import { DEFAULT_DATA } from "src/data";
import { IDBHotspot } from "src/types/hotspot";
import { IDBScene } from "src/types/scene";
import { TPano } from "src/types/pano";
import { moveCamera } from "src/helpers/camera";
import "./toolbar.styles.scss";

interface IProps {
  onMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void;
}

interface IUploadedImage {
  metaData: FullMetadata;
  url: string;
}

const Toolbar = (props: IProps) => {
  const { selectedObj, previewMode, activeScene } = useThree();
  const { logout } = useAuth();
  const params = useParams();
  const {
    setSelectedObj,
    togglePreviewMode,
    setInfoTitle,
    setInfoBody,
    setTargetScene,
    setActiveScene,
  } = useUpdate();
  const [showImageRack, toggleImageRack] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [open, setOpen] = useState(false);
  const icon = success ? faCheck : faUpload;
  const [hotspots, setHotspots] = useState<
    Mesh<SphereGeometry, MeshBasicMaterial>[]
  >([]);
  const [uploadedImages, setUploadedImages] = useState<IUploadedImage[]>([]);
  const [dbScenes, setDbScenes] = useState<IDBScene[]>([]);
  const databaseRef = dbRef(
    db,
    `tours/sobha-developers/${params.id}/${params.tourId}`
  );

  const addHotspot =
    (type: THotspotType = "right") =>
    () => {
      /** https://stackoverflow.com/questions/11036106/three-js-projector-and-ray-objects */
      const center = getScreenCenter();
      const pano = scene.children.find((sc) => sc.userData.active === true);
      const hs = Hotspot({ type, newHotspot: true });

      if (center) hs.position.copy(center.clone());

      setHotspots((prev) => [...prev, hs]);
      setSelectedObj(hs);
      setInfoTitle("");
      setInfoBody("");
      setTargetScene("");

      /** Converting to the pano's local system before adding it to the scene */
      pano.worldToLocal(hs.position);
      pano.add(hs);
    };

  const addHotspots = (pano: TPano) => (hspt: IDBHotspot) => {
    const hs = Hotspot({ type: hspt.userData.type });
    hs.position.set(hspt.position.x, hspt.position.y, hspt.position.z);
    hs.userData = hspt.userData;

    setHotspots((prev) => [...prev, hs]);

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

  /** Modal close */
  const handleClose = () => setOpen(false);

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
    const zero = uploadedImages.length === 0;
    const promises: Promise<IUploadedImage>[] = [];
    const dbPayload = [];

    /** Show loading indicator */
    setLoading(true);

    imagesArray.forEach((img, i) => {
      const firstUpload = zero && i === 0 ? "1" : "0";
      const uuid = v4();
      const id = uploadedImages.length + i + 1;
      const fullPath = `sobha-developers/${params.id}/${params.tourId}/${img.name}__${uuid}`;
      const imageRef = ref(storage, fullPath);
      const uploadTask = uploadBytesResumable(imageRef, img, {
        customMetadata: {
          name: img.name.replace(/\.[^/.]+$/, ""),
          title: params.id.split("-").join(" "),
          firstUpload,
          id: id.toString(),
          uuid,
        },
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
      dbPayload.push({ id, fullPath });
    });

    const urls = await Promise.all(promises);
    if (urls.length > 0) {
      /** Update the Database with the paths to the images in storage */
      await update(databaseRef, { scenes: dbPayload });
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      setUploadedImages((prev) => [...prev, ...urls]);
    }
  };

  const handleLogout = () => logout();

  const handlePublish = async () => {
    try {
      await update(databaseRef, {
        status: "Published",
        scenes: getSceneData(),
      });
      setPublishSuccess(true);
    } catch (error) {
      console.error(error);
      setPublishSuccess(false);
    }
    setOpen(true);
  };

  const run = () => {
    const existingScene = scene.children.find((sc: TPano) => {
      const currentActive =
        sc.userData.fullPath === activeScene.metaData.fullPath;

      if (currentActive) sc.userData.active = true;
      if (!currentActive) {
        sc.userData.active = false;
        sc.material.map = null;
        sc.material.needsUpdate = true;
      }

      return currentActive;
    });

    if (existingScene) {
      loader({ img: activeScene.url, mesh: existingScene });
      /** Move camera to the currently */
      moveCamera(existingScene);
    }

    if (!existingScene) {
      dbScenes.forEach((sc, i) => {
        const num = scene.children.length === 0 ? i : scene.children.length;
        const activeSceneId = parseInt(activeScene.metaData.customMetadata.id);
        const currentlyActiveScene = sc.id === activeSceneId;
        const shouldAddHotspots = sc && sc.hotspots && sc.hotspots.length > 0;

        /** Get all the mesh */
        const pano = Pano();

        /** Set the position of the pano */
        pano.position.set(0, 0, DEFAULT_DATA.pano_radius * 5 * num);

        /** Setting fullPath */
        pano.userData.fullPath = sc.fullPath;

        if (shouldAddHotspots) sc.hotspots.forEach(addHotspots(pano));

        if (currentlyActiveScene) {
          pano.userData.active = true;
          loader({ img: activeScene.url, mesh: pano });
          /** Move camera to the currently active scene */
          moveCamera(pano);
        }

        /** Add to scene */
        scene.add(pano); // World Space
      });
    }
  };

  /** Automatically set the 1st uploaded images to the currently active scene */
  useEffect(() => {
    const set = !activeScene && uploadedImages.length > 0;
    if (set) {
      const sc = uploadedImages.find(
        (img) => img.metaData.customMetadata.firstUpload === "1"
      );
      setActiveScene(sc);
    }
  }, [activeScene, uploadedImages]);

  useEffect(() => {
    const imageListRef = ref(
      storage,
      `sobha-developers/${params.id}/${params.tourId}`
    );
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
  }, [params]);

  useEffect(() => {
    /** Get all the mesh */
    if (activeScene) {
      /** Close image rack */
      if (showImageRack) toggle();
      run();
    }
  }, [activeScene, dbScenes]);

  useEffect(() => {
    if (uploadedImages.length > 0) {
      const fetch = async () => {
        const res = await get(databaseRef);

        if (res.exists()) {
          const scenesfromDB: IDBScene[] = res.val().scenes;
          if (scenesfromDB) setDbScenes(scenesfromDB);
        }
      };
      fetch();
    }
  }, [uploadedImages]);

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      className="toolbar__container"
      data-preview-mode={previewMode}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        className="toolbar"
      >
        {!previewMode && (
          <>
            <Stack direction="row" spacing={1}>
              <IconButton
                className="hotspot__add"
                aria-label="add"
                color="primary"
                onClick={addHotspot()}
                disabled={!activeScene}
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
              <IconButton
                disabled={uploadedImages.length === 0}
                className="image__gallery"
                aria-label="image gallery"
                onClick={toggle}
              >
                <FontAwesomeIcon icon={faImages} />
              </IconButton>
            </Stack>
            <Type />
          </>
        )}
        {previewMode && (
          <Button size="large" aria-label="publish" onClick={handlePublish}>
            Publish
          </Button>
        )}
        <Button size="large" aria-label="preview" onClick={togglePreview}>
          {previewMode ? "Exit" : "Preview"}
        </Button>
      </Stack>
      <Divider orientation="vertical" variant="middle" flexItem />
      <Button
        className="logout__button"
        size="large"
        aria-label="logout"
        onClick={handleLogout}
      >
        Logout
      </Button>
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
      <PublishModal
        open={open}
        handleClose={handleClose}
        success={publishSuccess}
      />
    </Stack>
  );
};

export default Toolbar;
