import React from 'react';
import ReactDOM from 'react-dom/client';
import PivotTable from './components/PivotTable';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <PivotTable />
  </React.StrictMode>
);
