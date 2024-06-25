import React, { useState, useEffect } from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { styled } from '@mui/system';

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderBottom: `1px solid rgba(0, 0, 0, 0.2);`,
}));

const PopularMemesTitle = styled('div')({
    display: 'flex',
    alignItems: 'center', /* Vertical centering */
    textAlign: 'center',
    padding: '4px',
});

const Center = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
});

const TotalResultsDiv = styled('div')({
    display: 'flex',
    alignItems: 'center', /* Vertical centering */
    justifyContent: 'center',
    textAlign: 'center',
    marginTop: '0.7em',
    marginBottom: '1.2em',
    fontSize: '0.8em',
    color: 'rgba(0, 0, 0, 0.75)',
    fontWeight: 400,
});

export default function PopularMeme() {
    const [popularData, setPopularData] = useState(null);
    const [error, setError] = useState(null);
    const [beginDate, setBeginDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [memeCount, setMemeCount] = useState(null);

    useEffect(() => {
        fetch('http://localhost:5000/getPopular')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setPopularData(data.result);
                setBeginDate(data.earliest_timestamp);
                setEndDate(data.latest_timestamp);
                setMemeCount(data.memeCount);
            })
            .catch(err => {
                setError(err.message);
            });
    }, []);

    if (error) {
        return <div>{`Error: ${error}`}</div>;
    }

    if (!popularData) {
        return <div>Loading...</div>;
    }
    console.log(popularData);
    return (
        <>
            <PopularMemesTitle>
                <div style={{ margin:'0.8em'}}>Top Popular Memes from {beginDate} to {endDate}</div>
                <HelpOutlineIcon style={{ fill:'rgba(0, 0, 0, 0.8)'}}/>
            </PopularMemesTitle>
            <Center>
                <StyledTableContainer component={Paper} elevation={0} style={{ width:'92vw'}}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                    </TableHead>
                    <TableBody>
                    {popularData.map((row) => (
                        <TableRow
                        key={row.ClusterID}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                        <TableCell component="th" scope="row">
                            {row.ClusterID}
                        </TableCell>
                        <TableCell align="right">{row.ClusterSize} Mutations</TableCell>
                        <TableCell align="right">{row.Timestamp}</TableCell>
                        <TableCell align="right">{row.Quote}</TableCell>
                        <TableCell align="right">{row.protein}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </StyledTableContainer>
                <TotalResultsDiv>
                    Showing Top 5 of {memeCount} memes
                </TotalResultsDiv>
            </Center>
        </>
    );
}