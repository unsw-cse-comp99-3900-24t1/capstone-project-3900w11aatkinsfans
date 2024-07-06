import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { styled } from '@mui/system';
import { Tabs, Tab } from '@mui/material';

// Styled components
const HeaderNavDiv = styled('div')({
  top: '0',
  left: '0',
  width: '100%',
  height: '60px',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  background: 'rgb(12,65,96)',
});

const AppTitle = styled(Link)({
  display: 'flex',
  justifyContent: 'center', /* Horizontal centering */
  alignItems: 'center', /* Vertical centering */
  color: 'white',
  fontSize: '32px',
  fontWeight: 600,
  padding: '10px',
  textDecoration: 'none',
});

const TabsContainer = styled('div')({
  flexGrow: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
});

const StyledTab = styled(Tab)({
  color: 'white',
  fontWeight: 'bold',
  fontFamily: 'Inter, sans-serif',
});

export default function HeaderNav() {
  const location = useLocation();
  const currentPath = location.pathname;

  const tabToValue = (path) => {
    switch (path) {
      case '/dashboard':
        return 0;
      case '/test':
        return 1;
      default:
        return 0;
    }
  };

  const [value, setValue] = useState(tabToValue(currentPath));

  useEffect(() => {
    setValue(tabToValue(currentPath));
  }, [currentPath]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <div />
      <HeaderNavDiv>
        <AppTitle to="/dashboard">Meme Analytics</AppTitle>
        <TabsContainer>
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="inherit"
            indicatorColor="secondary"
            TabIndicatorProps={{ style: { backgroundColor: 'rgb(195,206,218)' } }}
          >
            <StyledTab
              label="Dashboard"
              component={Link}
              to="/dashboard"
            />
            <StyledTab
              label="Test"
              component={Link}
              to="/test"
            />
          </Tabs>
        </TabsContainer>
      </HeaderNavDiv>
      <Outlet />
    </>
  );
}