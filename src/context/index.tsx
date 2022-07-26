import React, { useContext, useState } from "react";

/** Threejs Context */
const ThreejsContext = React.createContext(null);
const ThreejsUpdateContext = React.createContext(null);

export const useThree = () => useContext(ThreejsContext);
export const useUpdate = () => useContext(ThreejsUpdateContext);

const ThreejsProvider = ({ children }) => {
  const [editRequests, setEditRequests] = useState(null);
  const [selectedObj, setSelectedObj] = useState(null);
  const [selIcon, setIcon] = useState(null);
  const [executions, setExecutions] = useState(null);

  /** Puts the action Parameters data into the selected objects user data */
  // useEffect(() => {
  //   const { message, id, path, dataName, title } = actionParams;
  //   if (selObj) {
  //     selObj.userData = {
  //       ...selObj.userData,
  //       message,
  //       title,
  //       path,
  //       id,
  //       dataName,
  //     };
  //   }
  // }, [selObj]);

  const threeCxt = {
    selectedObj,
    selIcon,
    editRequests,
    executions,
  };

  const threeUpdate = {
    setSelectedObj,
    setIcon,
    setEditRequests,
    setExecutions,
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
