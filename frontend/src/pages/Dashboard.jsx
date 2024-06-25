import React from 'react';
import { Outlet } from 'react-router-dom';
import { styled } from '@mui/system';

// import MainGraph from '../components/MainGraph';
import PopularMeme from '../components/PopularMeme';

export default function Dashboard () {
  const PopularityGraphDiv = styled('div')({
    width: '100vw',
    height: '60vh',
    display: 'flex',
    justifyContent: 'center', 
    alignItems: 'flex-start', 
    marginTop: '3vh'
  });
  const PopularityGraph = styled('div')({
    width: '94vw',
    height: '56vh',
    display: 'flex',
    backgroundColor: 'white',
    justifyContent: 'center', 
    borderRadius: '12px',
  });
  const CurrentMemesDiv = styled('div')({
    width: '100vw',
    height: '30vh',
    display: 'flex',
    justifyContent: 'center', 
    alignItems: 'flex-start', 
  });
  const CurrentMemes = styled('div')({
    width: '94vw',
    height: '30vh',
    display: 'flex',
    justifyContent: 'space-between', 
    alignItems: 'flex-start', 
  });
  const CurrentMemesBoard = styled('div')({
    width: '94vw',
    height: 'auto',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    borderRadius: '12px',
  });
  return (
    <>
      <div>
        <PopularityGraphDiv>
          {/* <MainGraph /> */}
        </PopularityGraphDiv>
      </div>
      <div>
        <CurrentMemesDiv>
          <CurrentMemes>
            <CurrentMemesBoard>
              <PopularMeme/>
            </CurrentMemesBoard>
          </CurrentMemes>
        </CurrentMemesDiv>
      </div>
    </>
  );
}