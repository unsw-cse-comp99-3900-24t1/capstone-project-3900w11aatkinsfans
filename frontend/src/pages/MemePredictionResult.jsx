import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const ResultPage = () => {
  const location = useLocation();
  const { data } = location.state || [];

  useEffect(() => {
    console.log(data)
  }, [data]);

  return (
    <>
    test
    </>
  );
};

export default ResultPage;