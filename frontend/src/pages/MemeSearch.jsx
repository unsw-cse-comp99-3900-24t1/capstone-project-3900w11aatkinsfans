import React, { useState } from 'react';
import { TextField, Paper, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/system';

const StyledPaper = styled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '2px',
  borderRadius: 50,
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  maxWidth: 600,
  height: '50px',
  margin: '0 auto',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    padding: '0 20px', // Padding inside the input field
  },
}));

const SearchBar = () => {
  const [searchText, setSearchText] = useState('');

  const handleSearchClick = () => {
    console.log(searchText);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission or any default action
      handleSearchClick();
    }
  };

  return (
    <StyledPaper>
      <StyledTextField
        variant="standard"
        placeholder="Search..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onKeyDown={handleKeyDown}
        InputProps={{
          disableUnderline: true,
          endAdornment: (
            <InputAdornment position="end">
              <IconButton edge="end" onClick={handleSearchClick}>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
          style: { flex: 1 },
        }}
        fullWidth
      />
    </StyledPaper>
  );
};

export default function MemeSearch() {
  return (
    <div>
      <p>This is the Meme search page.</p>
      <SearchBar />
    </div>
  );
}


// export default function test() {
//   // test
//   const [message, setMessage] = React.useState('Running test...');
//   React.useEffect(() => {
//     fetch(process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/test')
//       .then(response => {
//         if (!response.ok) {
//           throw new Error('Bad response');
//         }
//         return response.json();
//       })
//       .then(data => {
//         setMessage(data.message);
//       })
//       .catch(err => {
//         setMessage('FAILED, as something related to fetching backend data is not working :(');
//       });
//   }, []);

//   return (
//     <div>
//       <p>This is the Test component content.</p>
//       <p>Test: {message} </p>
//     </div>
//   );
// };
