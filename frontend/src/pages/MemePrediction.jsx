import React, { useState } from "react";
import {
  TextField,
  Paper,
  InputAdornment,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
  Typography,
  Box,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/system";
import QuestionButton from "../components/QuestionButton";

const Container = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  padding: "20px", // Add some padding for better spacing
});

const StyledPaper = styled(Paper)(() => ({
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

const StyledTextField = styled(TextField)(() => ({
  "& .MuiInputBase-root": {
    padding: "0 20px", // Padding inside the input field
  },
}));

const SearchBar = ({ setIsModalOpen }) => {
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const handleSearchClick = () => {
    if (searchText.trim() === "") {
      setIsModalOpen(true);
      return;
    }

    setIsModalOpen(false);
    console.log(searchText);
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
        console.log(data);
        navigate("/memepredictionresult", { state: { data } });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission or any default action
      handleSearchClick();
    }
  };

  return (
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
  );
};

export default function MemePrediction() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  return (
    <div>
      <p>This is the Meme prediction page.</p>
      <SearchBar />
    </div>
  );
}
