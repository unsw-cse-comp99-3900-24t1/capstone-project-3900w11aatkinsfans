import React, { useState, useEffect } from 'react';

export default function PopularMeme() {
    const [popularData, setPopularData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:5000/getPopular')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setPopularData(data.result);
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
    console.log(popularData);
    return (
        <div>
            <h1>Popular Memes</h1>
            {/* Time Series section */}
            <h2>Time Series</h2>
            <ul>
                {popularData.map((entry, index) => (
                    <li key={index}>
                        Cluster {entry.ClusterID} - {entry.ClusterSize} - {entry.Timestamp}: {entry.Quote}
                    </li>
                ))}
            </ul>
        </div>
    );
}