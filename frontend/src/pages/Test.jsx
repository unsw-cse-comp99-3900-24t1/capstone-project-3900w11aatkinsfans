import React from 'react';

export default function Test () {
  const [message, setMessage] = useState('');
  setMessage('deine mutter');
  // React.useEffect(() => {
  //   fetch(process.env.REACT_APP_BACKEND_URL + '/test' || 'http://localhost:5000/test')
  //     .then(response => {
  //       if (!response.ok) {
  //         throw new Error('Bad response');
  //       }
  //       return response.json();
  //     })
  //     .then(data => {
  //       setMessage(data.message);
  //     })
  //     .catch(err => {
  //       setMessage('FAILED, as something related to fetching backend data is not working :(');
  //     });
  // }, []);

  return (
    <div>
      Test: {message}
    </div>
  )
}