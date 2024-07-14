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
  fontFamily: 'Inter, sans-serif',
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
      case '/memesearch':
        return 1;
      case '/memeprediction':
        return 2;
      default:
        return false;
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
              value={0} // Assign value prop
              component={Link}
              to="/dashboard"
            />
            <StyledTab
              label="Meme Search"
              value={1} // Assign value prop
              component={Link}
              to="/memesearch"
            />
            <StyledTab
              label="Meme Prediction"
              value={2} // Assign value prop
              component={Link}
              to="/memeprediction"
            />
          </Tabs>
        </TabsContainer>
      </HeaderNavDiv>
      <Outlet />
    </>
  );
}