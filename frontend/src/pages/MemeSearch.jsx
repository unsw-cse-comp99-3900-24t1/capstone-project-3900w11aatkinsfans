import React, { useState, useEffect } from "react";
import {
  TextField,
  Paper,
  IconButton,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { COLOUR_PALETTE } from "../assets/constants";

const StyledPaper = styled(Paper)(() => ({
  display: "flex",
  alignItems: "center",
  padding: "2px",
  borderRadius: 50,
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  maxWidth: 600,
  height: "50px",
  margin: "0 auto",
  marginTop: "5vh",
}));

const StyledTitle = styled("h2")(() => ({
  width: "100vw",
  textAlign: "center",
  color: COLOUR_PALETTE[0],
  marginTop: "60px",
}));

const StyledTextField = styled(TextField)(() => ({
  "& .MuiInputBase-root": {
    padding: "0 20px",
  },
}));

const SearchResultDatabaseSize = styled("div")({
  display: "flex",
  justifyContent: "center",
  margin: "0 auto",
  textAlign: "center",
  marginTop: "3vh",
  fontSize: "13px",
});

const StyledTableContainer = styled(TableContainer)(() => ({
  borderBottom: `1px solid rgba(0, 0, 0, 0.2)`,
  borderRadius: "18px",
  overflowX: "auto",
  width: "45%",
  minWidth: "800px",
}));

const CenterTable = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  marginTop: "12vh",
  paddingBottom: "30px",
});

const TopTrendingMemesTitle = styled("div")({
  marginBottom: "20px",
  fontSize: "20px",
});

const CenteredCircularProgress = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginTop: "8vh",
  height: "auto",
});

const SearchBar = ({ setLoading }) => {
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchClick = () => {
    if (searchText.trim() === "") {
      setIsModalOpen(true);
      return;
    }

    setLoading(true);
    setIsModalOpen(false);
    fetch(
      (process.env.REACT_APP_BACKEND_URL || "http://localhost:5000") +
        "/memesearch",
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
        // navigate(`/meme/${data.clusterID}`);
        let test_result = [];
        for (let cluster of data) {
          test_result.push(cluster.clusterID);
        }
        navigate("/memesearchresult", { state: { test_result } });
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error:", error);
      });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearchClick();
    }
  };

  return (
    <>
      <StyledPaper>
        <StyledTextField
          variant="standard"
          placeholder="Search Meme..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={handleKeyDown}
          InputProps={{
            disableUnderline: true,
            endAdornment: (
              <IconButton edge="end" onClick={handleSearchClick}>
                <SearchIcon />
              </IconButton>
            ),
            style: { flex: 1 },
          }}
          fullWidth
        />
      </StyledPaper>
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
    </>
  );
};

// Function to calculate time from now
const timeFromNow = (timestamp) => {
  const now = new Date();
  const date = new Date(timestamp);
  const diff = now - date;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} days ago`;
  if (hours > 0) return `${hours} hours ago`;
  if (minutes > 0) return `${minutes} minutes ago`;
  return `${seconds} seconds ago`;
};

export default function MemeSearch() {
  const [popularData, setPopularData] = useState(null);
  const [error, setError] = useState(null);
  const [beginDate, setBeginDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [memeCount, setMemeCount] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(
      (process.env.REACT_APP_BACKEND_URL || "http://localhost:5000") +
        "/getPopular"
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setPopularData(data.result);
        setBeginDate(data.earliest_timestamp);
        setEndDate(data.latest_timestamp);
        const formattedMemeCount = data.memeCount
          ? new Intl.NumberFormat().format(data.memeCount)
          : "...";
        setMemeCount(formattedMemeCount);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  // Clicking on most popular memes table to search
  const handleCellClick = (clusterID) => {
    navigate(`/meme/${clusterID - 1}`);
  };

  if (error) {
    return <div>{`Error: ${error}`}</div>;
  }

  if (!popularData) {
    return (
      <>
        <StyledTitle>Search a Meme</StyledTitle>
        <SearchBar setLoading={setLoading} />
        <SearchResultDatabaseSize>Loading...</SearchResultDatabaseSize>
      </>
    );
  }

  return (
    <>
      <StyledTitle>Search a Meme</StyledTitle>
      <SearchBar setLoading={setLoading} />
      <SearchResultDatabaseSize>
        Search from a database of {memeCount} memes
      </SearchResultDatabaseSize>
      {loading && (
        <CenteredCircularProgress>
          <CircularProgress /> &nbsp; Searching...
        </CenteredCircularProgress>
      )}
      <CenterTable>
        <TopTrendingMemesTitle>Top Trending Memes</TopTrendingMemesTitle>
        <StyledTableContainer component={Paper} elevation={0}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableBody>
              {popularData.map((row) => (
                <TableRow
                  key={row.ClusterID}
                  sx={{
                    height: "60px",
                    "&:last-child td, &:last-child th": { border: 0 },
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.1)",
                    },
                  }}
                  onClick={() => handleCellClick(row.ClusterID)}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{ color: "rgb(123, 123, 125)" }}
                  >
                    {row.ClusterID}
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{
                      textTransform: "capitalize",
                      padding: "16px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleCellClick(row.ClusterID)}
                  >
                    {row.Quote}
                  </TableCell>
                  <TableCell
                    sx={{ width: "100px", color: "rgb(174, 176, 175)" }}
                  >
                    {timeFromNow(row.Timestamp)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </CenterTable>
    </>
  );
}
