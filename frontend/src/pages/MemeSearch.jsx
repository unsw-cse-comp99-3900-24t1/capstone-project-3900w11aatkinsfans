import React from 'react';

export default function MemeSearch() {
  // test
  const [message, setMessage] = React.useState('Running test...');
  React.useEffect(() => {
    fetch(process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/test')
      .then(response => {
        if (!response.ok) {
          throw new Error('Bad response');
        }
        return response.json();
      })
      .then(data => {
        setMessage(data.message);
      })
      .catch(err => {
        setMessage('FAILED, as something related to fetching backend data is not working :(');
      });
  }, []);

  return (
    <div>
      <p>This is the Test component content.</p>
      <p>Test: {message} </p>
    </div>
  );
};
