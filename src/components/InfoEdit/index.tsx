import TextField from "@mui/material/TextField";
import { useUpdate, useThree } from "src/context";
import "./styles.scss";

const InfoEdit = () => {
  const { infoTitle, infoBody } = useThree();
  const { setInfoTitle, setInfoBody } = useUpdate();
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const title = event.target.id === "info__hotspot_title";
    const value = event.target.value;
    title ? setInfoTitle(value) : setInfoBody(value);
  };

  return (
    <>
      <TextField
        margin="dense"
        sx={{ color: "white" }}
        fullWidth
        id="info__hotspot_title"
        label="Title"
        value={infoTitle}
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
        value={infoBody}
        onChange={handleChange}
      />
    </>
  );
};

export default InfoEdit;
