import ReactDOM from "react-dom/client";
import { THotspotType } from "../../../types/hotspot";

const createTooltipHTML = (type?: THotspotType) => {
  const tooltipEl = document.createElement("div");
  tooltipEl.className =
    type === "editRequest" ? "tooltiptext tooltip-select" : "tooltiptext";
  tooltipEl.textContent = "Tooltip Text";

  /** To enable usage of elements inside the tooltip OrbitalControls need to be disabled */
  tooltipEl.onmouseover = () => controls.disable();
  tooltipEl.onmouseout = () => controls.enable();

  if (type === "editRequest") {
    /** Render to HTML using react */
    const root = ReactDOM.createRoot(tooltipEl);
    root.render(<EditReqElement />);
  }

  return tooltipEl;
};

const EditReqElement = () => (
  <>
    <textarea placeholder="Comment" id="edit_req__comments" />
    <select id="edit_req__select">
      <option value="">Select Request Type</option>
      <option value="Minimum requirement">Minimum requirement</option>
      <option value="Additional request">Additional request</option>
      <option value="CGI related">CGI related</option>
      <option value="Above and beyond">Above and beyond</option>
    </select>
    <div>
      <button id="unique-post-comment-button-2" type="submit" color="primary">
        Post
      </button>
      <button type="button" id="unique-post-delete-button-2" color="primary">
        Cancel
      </button>
    </div>
  </>
);

export default createTooltipHTML;
