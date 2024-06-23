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
  background: 'linear-gradient(90deg, rgb(74,0,153) 120px, rgb(42,121,203))',
});

export default function HeaderNav () {

  return (
    <>
      <div>
        <HeaderNavDiv />
      </div>
      <Outlet />
    </>
  );
}
