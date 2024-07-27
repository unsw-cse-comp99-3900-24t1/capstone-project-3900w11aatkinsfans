import React from 'react';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { COLOUR_PALETTE } from '../assets/constants';

const box_style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background
  boxShadow: 0,
  p: 4,
  borderRadius: '5px',
};

export default function QuestionButton(props) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [bgColor, setBgColor] = React.useState('transparent');

  return (
    <>
      <div style={{ ...props.style }}>
        <button
          style={{
            width: '50px',
            height: '50px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: bgColor,
            borderRadius: '25px',
            boxShadow: 'none',
            padding: 0,
            outline: 'none',
          }}
          onClick={handleOpen}
          onMouseEnter={() => setBgColor('rgba(0, 0, 0, 0.1)')}
          onMouseLeave={() => setBgColor('transparent')}
        >
          <HelpOutlineIcon style={{ fill: COLOUR_PALETTE[1] }} />
        </button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          sx={{ backdropFilter: 'blur(5px)' }} // Optional: Adds blur effect to the backdrop
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
