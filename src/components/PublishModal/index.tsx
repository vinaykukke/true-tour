import { useState } from "react";
import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { Stack } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faCircleXmark,
  faArrowUpRightFromSquare,
  faCopy,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import "./publishmodal.styles.scss";

interface IProps {
  success: boolean;
  open: boolean;
  handleClose: VoidFunction;
}

const PublishModal = (props: IProps) => {
  const params = useParams();
  const { success, open, handleClose } = props;
  const [copySuccess, setSuccess] = useState(false);
  const title = success ? "Success!" : "Oh-oh!";
  const description = success
    ? "Your tour has been published successfully."
    : "Something went wrong. We were unable to publish your tour.";
  const color = success ? "green" : "red";
  const icon = success ? faCheckCircle : faCircleXmark;
  const url = window.location.origin + `/tours/${params.id}/${params.tourId}`;

  const handleClick = () => window.open(url);
  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="publish__modal">
        <FontAwesomeIcon icon={icon} size="6x" color={color} />
        <Typography
          id="modal-modal-title"
          variant="h5"
          component="h2"
          sx={{ mt: 2 }}
        >
          {title}
        </Typography>
        {success && (
          <Stack
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="row"
          >
            <Box id="modal-modal-links" sx={{ m: 2, cursor: "pointer" }}>
              {!copySuccess && (
                <Tooltip title="Copy to clipboard!" arrow>
                  <FontAwesomeIcon
                    icon={faCopy}
                    size="2x"
                    onClick={handleCopy}
                  />
                </Tooltip>
              )}
              {copySuccess && (
                <FontAwesomeIcon icon={faCheck} size="2x" color="green" />
              )}
            </Box>
            <Box id="modal-modal-links" sx={{ m: 2, cursor: "pointer" }}>
              <Tooltip title="Open in new tab!" arrow>
                <FontAwesomeIcon
                  icon={faArrowUpRightFromSquare}
                  size="2x"
                  onClick={handleClick}
                />
              </Tooltip>
            </Box>
          </Stack>
        )}
        <Typography id="modal-modal-description" sx={{ m: 2 }}>
          {description}
        </Typography>
      </Box>
    </Modal>
  );
};

export default PublishModal;
