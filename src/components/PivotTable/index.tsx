// Main PivotTable component
import React, { useState } from 'react';
import ToolBar from './ToolBar';
import FieldsArea from './FieldsArea';
import DataGrid from './DataGrid';

interface ValueField {
  name: string;
  aggregation: string;
}

const PivotTable = () => {
  const [rows, setRows] = useState<string[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [values, setValues] = useState<ValueField[]>([]);
  const [filters, setFilters] = useState<string[]>([]);

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif' }}>
      <h2>Pivot Table</h2>
      <ToolBar />
      <div style={{ display: 'flex', gap: '24px', marginTop: '16px' }}>
        <FieldsArea
          rows={rows} setRows={setRows}
          columns={columns} setColumns={setColumns}
          values={values} setValues={setValues}
          filters={filters} setFilters={setFilters}
        />
        <DataGrid rows={rows} columns={columns} values={values} filters={filters} />
      </div>
    </div>
  );
};

export default PivotTable;
