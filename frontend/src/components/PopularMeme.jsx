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
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderBottom: `1px solid rgba(0, 0, 0, 0.2);`,
}));

const PopularMemesTitle = styled('div')({
    display: 'flex',
    alignItems: 'center', 
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
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    marginTop: '0.7em',
    marginBottom: '1.2em',
    fontSize: '0.8em',
    color: 'rgba(0, 0, 0, 0.75)',
    fontWeight: 400,
});

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 0,
    p: 4,
    borderRadius: '5px',
  };

export default function PopularMeme() {
    const [popularData, setPopularData] = useState(null);
    const [error, setError] = useState(null);
    const [beginDate, setBeginDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [memeCount, setMemeCount] = useState(null);
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetch((process.env.REACT_APP_BACKEND_URL ||
            'http://localhost:5000') +'/getPopular')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setPopularData(data.result.slice(0, 5));
                setBeginDate(data.earliest_timestamp);
                setEndDate(data.latest_timestamp);
                const formattedMemeCount = data.memeCount ? new Intl.NumberFormat().format(data.memeCount) : '...';
                setMemeCount(formattedMemeCount);
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

    // Clicking on most popular memes table to search 
    const handleCellClick = (clusterID) => {
        navigate(`/meme/${clusterID - 1}`);
    };

    return (
        <>  
            <PopularMemesTitle>
                <div style={{ margin:'0.5em'}}>Top Popular Memes from {beginDate} to {endDate}</div>
                <button style={{ width: '50px', height: '50px', backgroundColor: 'white', border: 'none', cursor: 'pointer' }} onClick={handleOpen}>
                    <HelpOutlineIcon style={{ fill:'rgba(0, 0, 0, 0.65)'}}/>
                </button>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Top Popular Memes
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        This table displays the top popular memes based on the number of mutations from the SNAP Memetracker Dataset. Mutations are the accidental or intentional modification of an original meme. 
                    </Typography>
                    </Box>
                </Modal>
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
                        sx={{ '&:last-child td, &:last-child th': { border: 0 },
                        '&:last-child td, &:last-child th': { border: 0 },
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        }, }}
                        >
                            <TableCell component="th" scope="row" 
                            sx={{ textTransform: 'capitalize', padding: '10px', cursor: 'pointer'}}
                            onClick={() => handleCellClick(row.ClusterID)}>{row.ClusterID}
                            </TableCell>
                            <TableCell align="right" sx={{ textTransform: 'capitalize', padding: '10px', cursor: 'pointer'}}
                            onClick={() => handleCellClick(row.ClusterID)}
                            > {row.ClusterSize} Mutations
                            </TableCell>
                            <TableCell align="right" sx={{ textTransform: 'capitalize', padding: '10px', cursor: 'pointer'}}
                            onClick={() => handleCellClick(row.ClusterID)}>{row.Timestamp}
                            </TableCell>
                            <TableCell align="right" sx={{ textTransform: 'capitalize', padding: '10px', cursor: 'pointer'}}
                            onClick={() => handleCellClick(row.ClusterID)}>{row.Quote}
                            </TableCell>
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