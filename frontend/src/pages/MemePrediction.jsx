import React, { useState } from "react";
import {
  TextField,
  Paper,
  InputAdornment,
  IconButton,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
  Box,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/system";
import QuestionButton from "../components/QuestionButton";
import { COLOUR_PALETTE } from "../assets/constants";

const StyledTitle = styled("h2")(() => ({
  color: COLOUR_PALETTE[0],
  marginTop: "40px",
}));

const Container = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  padding: "20px", // Add some padding for better spacing
});

const StyledPaper = styled(Paper)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: "2px",
  borderRadius: 50,
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  maxWidth: 550, // Make the search bar wider
  height: "50px",
  marginTop: theme.spacing(2),
  width: "100%", // Ensure it takes full width available
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    padding: "0 20px", // Padding inside the input field
  },
}));

const SearchBar = ({ setIsModalOpen }) => {
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearchClick = () => {
    if (searchText.trim() === "") {
      setIsModalOpen(true);
      return;
    }

    setIsModalOpen(false);
    if (!loading) {
      setLoading(true);
      fetch(
        (process.env.REACT_APP_BACKEND_URL || "http://localhost:5000") +
          "/memepredict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ searchText }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          setLoading(false);
          navigate("/memepredictionresult", { state: { data } });
        })
        .catch((error) => {
          setLoading(false);
          console.error("Error:", error);
        });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission or any default action
      handleSearchClick();
    }
  };

  return (
    <>
      <StyledPaper>
        <StyledTextField
          variant="standard"
          placeholder="Search..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={handleKeyDown}
          InputProps={{
            disableUnderline: true,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" onClick={handleSearchClick}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
            style: { flex: 1 },
          }}
          fullWidth
        />
      </StyledPaper>
      {loading && (
        <>
          <CircularProgress style={{ margin: "30px 0" }} />
          &nbsp; Processing Meme...
        </>
      )}
    </>
  );
};

export default function MemePrediction() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          gap: "20px",
        }}
      >
        <StyledTitle>Predict how your memes will perform</StyledTitle>
        <QuestionButton
          title="How To Use"
          text={
            <>
              This tool allows you to search and predict the performance of
              memes. Enter a meme description and click the search button to get
              predictions.
            </>
          }
          style={{ margin: "20px 0 0 -20px" }}
        />
      </Box>
      <SearchBar setIsModalOpen={setIsModalOpen} />

      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please enter a meme to search.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsModalOpen(false)}
            color="primary"
            autoFocus
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        aria-labelledby="help-dialog-title"
        aria-describedby="help-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="help-dialog-description">
            This tool allows you to search and predict the performance of memes.
            Enter a meme description and click the search button to get
            predictions.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsHelpModalOpen(false)}
            color="primary"
            autoFocus
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
