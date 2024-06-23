import React from 'react';
import { Outlet } from 'react-router-dom';
import { styled } from '@mui/system';

// Styled components

const HeaderNavDiv = styled('div')({
  top: '0',
  left: '0',
  width: '100%',
  height: '6.5vh',
  position: 'fixed',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  background: 'rgb(12,65,96)',
});

const AppTitle = styled('div')({
  display: 'flex',
  justifyContent: 'center', /* Horizontal centering */
  alignItems: 'center', /* Vertical centering */
  color: 'white',
  fontSize: '36px',
  padding: '10px',
})


export default function HeaderNav () {
  return (
    <>
      <div>
        <HeaderNavDiv>
          <AppTitle>
            Meme Analytics
          </AppTitle>
        </HeaderNavDiv>
      </div>
      <Outlet />
    </>
  );
}
