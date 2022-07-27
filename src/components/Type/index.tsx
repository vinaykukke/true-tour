import React, { useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useThree } from "src/context";

const Type = () => {
  const { selectedObj } = useThree();
  const disable = !Boolean(selectedObj);
  const [type, setType] = useState("");
  const [open, setOpen] = useState(false);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setType(event.target.value);
  };
  const toggleOpen = () => setOpen((prev) => !prev);

  return (
    <FormControl sx={{ minWidth: 120 }} size="small" disabled={disable}>
      <InputLabel id="demo-controlled-open-select-label">Type</InputLabel>
      <Select
        labelId="demo-controlled-open-select-label"
        id="demo-controlled-open-select"
        open={open}
        onClose={toggleOpen}
        onOpen={toggleOpen}
        value={type}
        label="Type"
        onChange={handleChange}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        <MenuItem value="right">Right</MenuItem>
        <MenuItem value="left">Left</MenuItem>
        <MenuItem value="up">Up</MenuItem>
        <MenuItem value="down">Down</MenuItem>
      </Select>
    </FormControl>
  );
};

export default Type;
