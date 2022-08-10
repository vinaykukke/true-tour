import { useState } from "react";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./login.styles.scss";
import { TextField } from "@mui/material";

const Login = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, togglePasswordVisibility] = useState(false);
  const icon = showPassword ? faEyeSlash : faEye;
  const handleClick = () => togglePasswordVisibility((prev) => !prev);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const emailField = event.target.id === "email";
    emailField ? setEmail(value) : setPassword(value);
  };

  return (
    <div className="container">
      <div className="top"></div>
      <div className="bottom"></div>
      <div className="center">
        <h2>Please Sign In</h2>
        <FormControl sx={{ minWidth: 120, width: 300 }}>
          <TextField
            id="email"
            type="email"
            placeholder="johndoe@email.com"
            label="Email"
            margin="dense"
            value={email}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            id="password"
            type={showPassword ? "text" : "password"}
            label="Password"
            margin="dense"
            value={password}
            onChange={handleChange}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClick}
                    edge="end"
                  >
                    <FontAwesomeIcon icon={icon} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </FormControl>
        <h2>&nbsp;</h2>
      </div>
    </div>
  );
};

export default Login;
