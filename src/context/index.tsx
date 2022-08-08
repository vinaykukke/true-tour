import React, { useContext, useState, useEffect } from "react";

/** Threejs Context */
const ThreejsContext = React.createContext(null);
const ThreejsUpdateContext = React.createContext(null);

export const useThree = () => useContext(ThreejsContext);
export const useUpdate = () => useContext(ThreejsUpdateContext);

const ThreejsProvider = ({ children }) => {
  const [editRequests, setEditRequests] = useState(null);
  const [selectedObj, setSelectedObj] = useState(null);
  const [previewMode, togglePreviewMode] = useState(false);
  const [infoTitle, setInfoTitle] = useState("");
  const [infoBody, setInfoBody] = useState("");
  const [targetScene, setTargetScene] = useState("");
  const defaultType = selectedObj ? selectedObj.userData.type : "";
  const [executions, setExecutions] = useState(null);
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
    editRequests,
    executions,
    targetScene,
    type,
    previewMode,
  };

  const threeUpdate = {
    setSelectedObj,
    setInfoTitle,
    setInfoBody,
    setEditRequests,
    setExecutions,
    setType,
    setTargetScene,
    togglePreviewMode,
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
