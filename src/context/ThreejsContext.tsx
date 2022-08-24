import React, { useContext, useState, useEffect } from "react";

/** Threejs Context */
const ThreejsContext = React.createContext(null);
const ThreejsUpdateContext = React.createContext(null);

export const useThree = () => useContext(ThreejsContext);
export const useUpdate = () => useContext(ThreejsUpdateContext);

const ThreejsProvider = ({ children }) => {
  const [selectedObj, setSelectedObj] = useState(null);
  const [previewMode, togglePreviewMode] = useState(false);
  const [infoTitle, setInfoTitle] = useState("");
  const [infoBody, setInfoBody] = useState("");
  const [targetScene, setTargetScene] = useState("");
  const [activeScene, setActiveScene] = useState(null);
  const defaultType = selectedObj ? selectedObj.userData.type : "";
  const [type, setType] = useState(defaultType);

  /** Default type set */
  useEffect(() => {
    if (!selectedObj) setType("");
    if (selectedObj) setType(selectedObj.userData.type);
  }, [selectedObj]);

  const threeCxt = {
    selectedObj,
    infoBody,
    infoTitle,
    targetScene,
    type,
    previewMode,
    activeScene,
  };

  const threeUpdate = {
    setSelectedObj,
    setInfoTitle,
    setInfoBody,
    setType,
    setTargetScene,
    togglePreviewMode,
    setActiveScene,
  };

  return (
    <ThreejsContext.Provider value={threeCxt}>
      <ThreejsUpdateContext.Provider value={threeUpdate}>
        {children}
      </ThreejsUpdateContext.Provider>
    </ThreejsContext.Provider>
  );
};

export default ThreejsProvider;
