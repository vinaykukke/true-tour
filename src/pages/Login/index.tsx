import { useEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import LoadingButton from "@mui/lab/LoadingButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "src/context/AuthContext";
import "./login.styles.scss";

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email && !password) return;

    try {
      setLoading(true);
      await login(email, password);
    } catch (error) {
      console.error("Email or Password is invalid!", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (user) navigate("/tool", { replace: true });
  }, [user, navigate]);

  return (
    <div className="container">
      <div className="top" />
      <div className="bottom" />
      <div className="center">
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <FormControl
            sx={{ minWidth: 120, width: 300 }}
            onChange={handleChange}
          >
            <TextField
              id="email"
              type="email"
              placeholder="johndoe@email.com"
              label="Email"
              margin="dense"
              value={email}
              fullWidth
            />
            <TextField
              id="password"
              type={showPassword ? "text" : "password"}
              label="Password"
              margin="dense"
              value={password}
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
            <LoadingButton
              type="submit"
              loading={loading}
              variant="contained"
              sx={{ marginTop: "20px" }}
            >
              Login
            </LoadingButton>
          </FormControl>
        </form>
        <h2>&nbsp;</h2>
      </div>
    </div>
  );
};

export default Login;
