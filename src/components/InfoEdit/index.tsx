import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { useUpdate, useThree } from "src/context/ThreejsContext";
import "./styles.scss";

const InfoEdit = () => {
  const [body, setBody] = useState("");
  const [title, setTitle] = useState("");
  const { infoTitle, infoBody, selectedObj } = useThree();
  const { setInfoTitle, setInfoBody } = useUpdate();
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const title = event.target.id === "info__hotspot_title";
    const body = event.target.id === "info__hotspot_body";
    const value = event.target.value;

    if (title) {
      setInfoTitle(value);
      selectedObj.userData.infoTitle = value;
    }

    if (body) {
      setInfoBody(value);
      selectedObj.userData.infoBody = value;
    }
  };

  useEffect(() => {
    const { userData } = selectedObj;
    const show = userData.infoBody && userData.infoTitle;

    if (show) {
      setBody(userData.infoBody);
      setTitle(userData.infoTitle);
    } else {
      setBody("");
      setTitle("");
    }
  }, [selectedObj]);

  return (
    <>
      <TextField
        margin="dense"
        sx={{ color: "white" }}
        fullWidth
        id="info__hotspot_title"
        label="Title"
        value={title ? title : infoTitle}
        onChange={handleChange}
      />
      <TextField
        id="info__hotspot_body"
        margin="dense"
        sx={{ color: "white" }}
        fullWidth
        label="Body"
        multiline
        maxRows={4}
        value={body ? body : infoBody}
        onChange={handleChange}
      />
    </>
  );
};

export default InfoEdit;
