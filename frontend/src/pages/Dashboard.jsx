import React from 'react';
import { styled } from '@mui/system';

import MainGraph from '../components/MainGraph';
import PopularMeme from '../components/PopularMeme';

export default function Dashboard () {
  const PopularityGraphDiv = styled('div')({
    width: '90vw',
    height: '620px',
    backgroundColor: 'white',
    justifyContent: 'center',
    margin: '3vh 3vw 30px 3vw',
    borderRadius: '12px',
    padding: '1vw',
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
  });

  const CurrentMemesDiv = styled('div')({
    width: '98vw',
    height: '30vh',
    display: 'flex',
    justifyContent: 'center', 
    alignItems: 'flex-start',
  });
  const CurrentMemes = styled('div')({
    width: '92vw',
    height: '30vh',
    display: 'flex',
    justifyContent: 'space-between', 
    alignItems: 'flex-start', 
  });
  const CurrentMemesBoard = styled('div')({
    width: '92vw',
    height: 'auto',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
  });
  return (
    <>
      <div>
        <PopularityGraphDiv>
          <MainGraph />
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