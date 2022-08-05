import { useState } from "react";
import TextField from "@mui/material/TextField";
import "./styles.scss";

const InfoEdit = () => {
  const [valueTitle, setTitle] = useState("");
  const [valueBody, setBody] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const title = event.target.id === "info__hotspot_title";
    const value = event.target.value;
    title ? setTitle(value) : setBody(value);
  };

  return (
    <>
      <TextField
        margin="dense"
        sx={{ color: "white" }}
        fullWidth
        id="info__hotspot_title"
        label="Title"
        value={valueTitle}
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
        value={valueBody}
        onChange={handleChange}
      />
    </>
  );
};

export default InfoEdit;
