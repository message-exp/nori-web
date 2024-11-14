import React from 'react';
import { PageProvider } from './context/PageContext';
import PageRouter from './components/PageRouter';

const App = () =>
{
  return (
    <PageProvider>
      <PageRouter />
    </PageProvider>
  );
};

export default App;
