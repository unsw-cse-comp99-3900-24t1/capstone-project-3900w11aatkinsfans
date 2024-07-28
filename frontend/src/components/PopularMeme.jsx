import React, { useState, useEffect } from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import QuestionButton from "./QuestionButton";

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderBottom: `1px solid rgba(0, 0, 0, 0.2);`,
}));

const PopularMemesTitle = styled("div")({
  display: "flex",
  alignItems: "center",
  textAlign: "center",
  padding: "4px",
});

const Center = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
});

const TotalResultsDiv = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  marginTop: "0.7em",
  marginBottom: "1.2em",
  fontSize: "0.8em",
  color: "rgba(0, 0, 0, 0.75)",
  fontWeight: 400,
});

export default function PopularMeme() {
  const [popularData, setPopularData] = useState(null);
  const [error, setError] = useState(null);
  const [beginDate, setBeginDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [memeCount, setMemeCount] = useState(null);
  const navigate = useNavigate();

  // Load most popular memes
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
        setPopularData(data.result.slice(0, 5));
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

  if (error) {
    return <div>{`Error: ${error}`}</div>;
  }

  // While waiting for fetch, show loading
  if (!popularData) {
    return (
      <div style={{ margin: "0.5em" }}>Loading data for Popular Memes...</div>
    );
  }

  // Clicking on most popular memes table to search
  const handleCellClick = (clusterID) => {
    navigate(`/meme/${clusterID - 1}`);
  };

  return (
    <>
      <PopularMemesTitle>
        <div style={{ margin: "0.5em" }}>
          Top Popular Memes from {beginDate} to {endDate}
        </div>
        <QuestionButton
          title="Top Popular Memes"
          text="This table displays the top popular memes based on the
          number of mutations from the SNAP Memetracker Dataset. Mutations
          are the accidental or intentional modification of an original meme. "
        />
      </PopularMemesTitle>
      <Center>
        <StyledTableContainer
          component={Paper}
          elevation={0}
          style={{ width: "92vw" }}
        >
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead></TableHead>
            <TableBody>
              {popularData.map((row) => (
                <TableRow
                  key={row.ClusterID}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    "&:last-child td, &:last-child th": { border: 0 },
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.1)",
                    },
                  }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{
                      textTransform: "capitalize",
                      padding: "10px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleCellClick(row.ClusterID)}
                  >
                    {row.ClusterID}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      textTransform: "capitalize",
                      padding: "10px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleCellClick(row.ClusterID)}
                  >
                    {" "}
                    {row.ClusterSize} Mutations
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      textTransform: "capitalize",
                      padding: "10px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleCellClick(row.ClusterID)}
                  >
                    {row.Timestamp}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      textTransform: "capitalize",
                      padding: "10px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleCellClick(row.ClusterID)}
                  >
                    {row.Quote}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
        <TotalResultsDiv>Showing Top 5 of {memeCount} memes</TotalResultsDiv>
      </Center>
    </>
  );
}
