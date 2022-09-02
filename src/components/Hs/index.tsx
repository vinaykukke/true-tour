import { useEffect, useRef, useCallback } from "react";
import { Mesh } from "three";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import { FullMetadata } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faArrowRight,
  faArrowLeft,
  faArrowUp,
  faInfo,
  faTrash,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import { useThree, useUpdate } from "src/context/ThreejsContext";
import SceneList from "src/components/SceneList";
import InfoEdit from "src/components/InfoEdit";
import { isMobile } from "src/helpers/isMobile";
import { moveCamera } from "src/helpers/camera";
import "./hotspot.styles.scss";

interface IProps {
  onMouseMove?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  mesh: Mesh;
  tabIndex: number;
  deleteHotspot?: () => void;
  scenes?: IUploadedImage[];
  publishedMode?: boolean;
  editMode?: boolean;
}

interface IUploadedImage {
  metaData: FullMetadata;
  url: string;
}

const Hotspot = (props: IProps) => {
  const { mesh, onMouseMove, tabIndex, publishedMode } = props;
  const {
    userData: {
      type,
      sceneName,
      infoBody,
      infoTitle,
      executable,
      targetScene,
      sceneId,
    },
    children,
  } = mesh;
  const hsRef = useRef(null);
  const { selectedObj, previewMode, executeOnMobile } = useThree();
  const { setSelectedObj, setExecuteOnmobile } = useUpdate();
  const editMode = !publishedMode && !previewMode;
  const mode = publishedMode ? publishedMode : previewMode;
  const showTools = !mode && Boolean(selectedObj) && mesh.id === selectedObj.id;
  const expandInfoHotspot =
    mode &&
    type === "info" &&
    Boolean(mesh.userData?.infoTitle) &&
    Boolean(mesh.userData?.infoBody);
  const expandOnDesktop = previewMode || publishedMode;
  const shouldExpand = executeOnMobile ? executeOnMobile : expandOnDesktop;

  const handleMouseOver = () => controls.disable();
  const handleMouseOut = () => controls.enable();

  useEffect(() => {
    /** Removing existing labels because react will replace them when the hotspot is deleted */
    if (children.length > 0) {
      children.forEach((child) => child.parent.remove(child));
    }

    /** Adding the label to the Hotspot mesh */
    const label = new CSS2DObject(hsRef.current);
    mesh.add(label);
  }, [mesh, children]);

  useEffect(() => {
    const selectedObject = selectedObj && mesh.id === selectedObj.id;

    if (selectedObject) hsRef.current.classList.add("hotspot__focus");

    if (!selectedObject) {
      const hasFocus = hsRef.current.classList.contains("hotspot__focus");
      if (hasFocus) hsRef.current.classList.remove("hotspot__focus");
    }
  }, [selectedObj, mesh]);

  useEffect(() => {
    if (mode) {
      /** Removes the focus of newly added hotspot */
      const hs = document.getElementsByClassName("hotspot__focus");
      for (let i = 0; i < hs.length; i++) {
        const element = hs[i];
        element.classList.remove("hotspot__focus");
      }

      /** Remove the selected object */
      setSelectedObj(null);
    }
  }, [mode, setSelectedObj]);

  const renderHotspots = () => {
    let icon = null;

    switch (type) {
      case "down":
        icon = faArrowDown;
        break;

      case "left":
        icon = faArrowLeft;
        break;

      case "right":
        icon = faArrowRight;
        break;

      case "up":
        icon = faArrowUp;
        break;

      case "info":
        icon = faInfo;
        break;

      default:
        icon = faArrowRight;
        break;
    }

    return <FontAwesomeIcon className="icons" icon={icon} />;
  };

  const renderEditTooltip = () => {
    let Tooltip = null;

    switch (type) {
      case "left":
      case "right":
      case "down":
      case "up":
        Tooltip = <SceneList scenes={props.scenes} />;
        break;

      case "info":
        Tooltip = <InfoEdit />;
        break;

      default:
        Tooltip = <SceneList scenes={props.scenes} />;
        break;
    }

    return Tooltip;
  };

  const execute = (uuid: string) => {
    const targetSceneUrl = targetScene;
    const shouldExecute = uuid === mesh.uuid;
    const execute = shouldExecute && executable && Boolean(targetSceneUrl);

    if (execute) {
      /** Always assuming that the taret scene has been added to the threejs scene */
      const uuid = sceneId;
      const targetScene = getTargetScene(uuid);
      moveCamera(targetScene);
      setExecuteOnmobile(false);
      /** Re-Enable controls if tour is being viewed on a recognized mobile device */
      if (isMobile.any()) controls.enable();
    }
  };

  const getTargetScene = useCallback(
    (id: string) => scene.children.find((sc) => sc.userData.sceneId === id),
    []
  );

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const mobile = isMobile.any();
    const uuid = e.currentTarget.dataset.uuid;

    if (mobile) setExecuteOnmobile(true);
    if (publishedMode || previewMode) {
      if (mobile && executeOnMobile) execute(uuid);
      if (!mobile) execute(uuid);
    }
  };

  /**
   * The className"hotspot__container" => root element for react to remove when hotspot is deleted.
   * If you remove this container - react will throw the following Exception:
   * "React DOMException: Failed to execute removeChild on Node".
   *
   * CSS2DObject() removes the Hotspot by directly manipulating the DOM and removing the root div.
   * But in React's virtual DOM, the root div still exists! So when you "deleteHotspot()" React tries to remove it
   * from the real DOM but since it's already gone, the error is thrown.
   *
   * https://stackoverflow.com/questions/54880669/react-domexception-failed-to-execute-removechild-on-node-the-node-to-be-re
   */
  return (
    <div className="hotspot__container">
      <div
        ref={hsRef}
        data-expand={shouldExpand}
        data-uuid={mesh.uuid}
        className="hotspot hotspot__focus"
        id={`hotspot__${mesh.uuid}`}
        onMouseMove={!previewMode ? onMouseMove : undefined}
        onClick={!editMode ? handleClick : undefined}
        tabIndex={tabIndex}
        onMouseOver={mode ? handleMouseOver : undefined}
        onMouseOut={mode ? handleMouseOut : undefined}
      >
        <div className="hotspot__title">
          {renderHotspots()}
          {!expandInfoHotspot && shouldExpand && (
            <div className="title">
              {sceneName ? sceneName : "No Target Selected"}
            </div>
          )}
          {expandInfoHotspot && <div className="title">{infoTitle}</div>}
        </div>
        {expandInfoHotspot && <div className="hotspot__body">{infoBody}</div>}
        {showTools && (
          <div
            className="hotspot__edit_tools"
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
          >
            <div className="hotspot__edit_icon hotspot__edit">
              <FontAwesomeIcon icon={faPen} />
              <div className="hotspot__edit_tooltiptext" data-type={type}>
                {renderEditTooltip()}
              </div>
            </div>
            <div className="hotspot__edit_icon" onClick={props.deleteHotspot}>
              <FontAwesomeIcon icon={faTrash} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hotspot;
