import React from "react";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { COLOUR_PALETTE } from "../assets/constants";

const box_style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 0,
  p: 4,
  borderRadius: "5px",
};

// Question Button props has: props.title and props.text
export default function QuestionButton(props) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [bgColor, setBgColor] = React.useState("white");

  return (
    <>
      <div style={{ ...props.style }}>
        <button
          style={{
            width: "50px",
            height: "50px",
            border: "none",
            cursor: "pointer",
            backgroundColor: bgColor,
            borderRadius: "25px",
          }}
          onClick={handleOpen}
          onMouseEnter={() => setBgColor("rgba(0, 0, 0, 0.1)")}
          onMouseLeave={() => setBgColor("white")}
        >
          <HelpOutlineIcon style={{ fill: COLOUR_PALETTE[1] }} />
        </button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={box_style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {props.title}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              {props.text}
            </Typography>
          </Box>
        </Modal>
      </div>
    </>
  );
}
