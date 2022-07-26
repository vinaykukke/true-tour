import { useEffect, useRef } from "react";
import { Mesh } from "three";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import { useThree } from "src/context";
import { IconDown, IconLeft, IconRight, IconUp } from "./HotspotElements";
import { SceneTooltip, DefaultTooltip } from "./TooltipElements";

interface IProps {
  onMouseMove: () => void;
  mesh: Mesh;
  tabIndex: number;
}

const Hotspot = (props: IProps) => {
  const { mesh, onMouseMove, tabIndex } = props;
  // const { userData } = mesh;
  const hsRef = useRef(null);
  const { selectedObj } = useThree();
  const showTooltip = true;
  const handleMouseOver = () => controls.disable();
  const handleMouseOut = () => controls.enable();

  useEffect(() => {
    /** Adding the label to the Hotspot mesh */
    const label = new CSS2DObject(hsRef.current);
    mesh.add(label);
  }, []);

  useEffect(() => {
    const selectedObject = selectedObj && mesh.id === selectedObj.id;

    if (selectedObject) hsRef.current.classList.add("hotspot__focus");

    if (!selectedObject) {
      const hasFocus = hsRef.current.classList.contains("hotspot__focus");
      if (hasFocus) hsRef.current.classList.remove("hotspot__focus");
    }
  }, [selectedObj, mesh]);

  const renderHotspots = (type = "right") => {
    let img = null;

    switch (type) {
      case "down":
        img = <IconDown />;
        break;

      case "left":
        img = <IconLeft />;
        break;

      case "right":
        img = <IconRight />;
        break;

      case "up":
        img = <IconUp />;
        break;

      default:
        img = <IconRight />;
        break;
    }

    return img;
  };

  const renderTooltip = (type = "right") => {
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

  return (
    <div
      ref={hsRef}
      className="hotspot hotspot__focus"
      id={`hotspot__${mesh.uuid}`}
      onMouseMove={onMouseMove}
      tabIndex={tabIndex}
    >
      {renderHotspots()}
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
  );
};

export default Hotspot;
