import { useEffect, useRef } from "react";
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
import { SceneTooltip, DefaultTooltip } from "./TooltipElements";
import "./hotspot.styles.scss";

interface IProps {
  onMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void;
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  mesh: Mesh;
  tabIndex: number;
  deleteHotspot: () => void;
  scenes: IUploadedImage[];
}

interface IUploadedImage {
  metaData: FullMetadata;
  url: string;
}

const Hotspot = (props: IProps) => {
  const { mesh, onMouseMove, tabIndex, onClick } = props;
  const {
    userData: { type },
    children,
  } = mesh;
  const hsRef = useRef(null);
  const { selectedObj, previewMode } = useThree();
  const { setSelectedObj } = useUpdate();
  const showTooltip = previewMode && type !== "info";
  const showTools =
    !previewMode && Boolean(selectedObj) && mesh.id === selectedObj.id;
  const expand =
    previewMode &&
    type === "info" &&
    Boolean(mesh.userData?.infoTitle) &&
    Boolean(mesh.userData?.infoBody);

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
    if (previewMode) {
      /** Removes the focus of newly added hotspot */
      const hs = document.getElementsByClassName("hotspot__focus");
      for (let i = 0; i < hs.length; i++) {
        const element = hs[i];
        element.classList.remove("hotspot__focus");
      }

      /** Remove the selected object */
      setSelectedObj(null);
    }
  }, [previewMode, setSelectedObj]);

  const renderHotspots = () => {
    let img = null;

    switch (type) {
      case "down":
        img = <FontAwesomeIcon className="icons" icon={faArrowDown} />;
        break;

      case "left":
        img = <FontAwesomeIcon className="icons" icon={faArrowLeft} />;
        break;

      case "right":
        img = <FontAwesomeIcon className="icons" icon={faArrowRight} />;
        break;

      case "up":
        img = <FontAwesomeIcon className="icons" icon={faArrowUp} />;
        break;

      case "info":
        img = <FontAwesomeIcon className="icons" icon={faInfo} />;
        break;

      default:
        img = <FontAwesomeIcon className="icons" icon={faArrowRight} />;
        break;
    }

    return img;
  };

  const renderTooltip = () => {
    let Tooltip = null;
    const name = mesh.userData.sceneName;

    switch (type) {
      case "left":
      case "right":
      case "down":
      case "up":
        Tooltip = <SceneTooltip name={name} />;
        break;

      default:
        Tooltip = <DefaultTooltip />;
        break;
    }

    return Tooltip;
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
        data-expand={expand}
        className="hotspot hotspot__focus"
        id={`hotspot__${mesh.uuid}`}
        onMouseMove={!previewMode ? onMouseMove : undefined}
        onClick={previewMode ? onClick : undefined}
        tabIndex={tabIndex}
        onMouseOver={previewMode ? handleMouseOver : undefined}
        onMouseOut={previewMode ? handleMouseOut : undefined}
      >
        <div className="hotspot__title">
          {renderHotspots()}
          {expand && <div className="title">{mesh.userData.infoTitle}</div>}
        </div>
        {expand && (
          <div className="hotspot__body">{mesh.userData.infoBody}</div>
        )}
        {showTooltip && (
          <div
            className="tooltiptext"
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
          >
            {renderTooltip()}
          </div>
        )}
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
