import { useEffect, useRef } from "react";
import { Mesh } from "three";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ArrowCircleDownOutlinedIcon from "@mui/icons-material/ArrowCircleDownOutlined";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
import ArrowCircleUpOutlinedIcon from "@mui/icons-material/ArrowCircleUpOutlined";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import { useThree } from "src/context";
import { SceneTooltip, DefaultTooltip } from "./TooltipElements";

interface IProps {
  onMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void;
  mesh: Mesh;
  tabIndex: number;
}

const Hotspot = (props: IProps) => {
  const { mesh, onMouseMove, tabIndex } = props;
  const {
    userData: { type },
    children,
  } = mesh;
  const hsRef = useRef(null);
  const { selectedObj, previewMode } = useThree();
  const showTooltip = false;
  const expand = previewMode && type === "info";

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

  const renderHotspots = () => {
    let img = null;

    switch (type) {
      case "down":
        img = (
          <ArrowCircleDownOutlinedIcon className="icons" fontSize="large" />
        );
        break;

      case "left":
        img = (
          <ArrowCircleLeftOutlinedIcon className="icons" fontSize="large" />
        );
        break;

      case "right":
        img = (
          <ArrowCircleRightOutlinedIcon className="icons" fontSize="large" />
        );
        break;

      case "up":
        img = <ArrowCircleUpOutlinedIcon className="icons" fontSize="large" />;
        break;

      case "info":
        img = <InfoOutlinedIcon className="icons" fontSize="large" />;
        break;

      default:
        img = <ArrowCircleRightOutlinedIcon />;
        break;
    }

    return img;
  };

  const renderTooltip = () => {
    let Tooltip = null;

    switch (type) {
      case "left":
      case "right":
      case "down":
      case "up":
        Tooltip = <SceneTooltip />;
        break;

      default:
        Tooltip = <DefaultTooltip />;
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
        onMouseMove={onMouseMove}
        tabIndex={tabIndex}
        onMouseOver={previewMode ? handleMouseOver : undefined}
        onMouseOut={previewMode ? handleMouseOut : undefined}
      >
        <div className="hotspot__title">
          {renderHotspots()}
          {expand && <div className="title">Viceroy Los Cabos</div>}
        </div>
        <div className="hotspot__body">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vero
          corporis fugit cum. Aperiam ex quae sequi molestias omnis veritatis
          eum nulla in nemo optio. Animi eos enim ipsum perferendis asperiores!
          Dolorem voluptatum natus ipsa commodi mollitia dolor cumque excepturi
          voluptates laborum repudiandae, vitae eos, dolorum voluptatem rem.
          Eveniet iusto nemo doloribus temporibus minus libero laborum tempora
          eum! Consequuntur, nihil consequatur! Ipsum illum quod autem
          distinctio odio, eveniet id dicta quisquam libero quam eum cum,
          architecto iste aliquid debitis. Asperiores velit laboriosam fugit
          inventore numquam vitae natus dolorem temporibus iusto itaque.
        </div>
        {showTooltip && (
          <div
            className="tooltiptext"
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
          >
            {renderTooltip()}
          </div>
        )}
      </div>
    </div>
  );
};

export default Hotspot;
