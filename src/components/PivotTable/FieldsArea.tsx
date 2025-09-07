// Drag-drop area for fields
import React, { useState } from 'react';

const mockFields = [
  { name: 'Region', type: 'string' },
  { name: 'Product', type: 'string' },
  { name: 'Sales', type: 'number' },
  { name: 'Quantity', type: 'number' },
  { name: 'Date', type: 'date' },
  { name: 'Category', type: 'string' },
  { name: 'Channel', type: 'string' },
  { name: 'Discount', type: 'number' },
  { name: 'Profit', type: 'number' },
];

const aggregationOptions = ['Sum', 'Average', 'Count'];

interface ValueField {
  name: string;
  aggregation: string;
}

interface FieldsAreaProps {
  rows: string[];
  setRows: React.Dispatch<React.SetStateAction<string[]>>;
  columns: string[];
  setColumns: React.Dispatch<React.SetStateAction<string[]>>;
  values: ValueField[];
  setValues: React.Dispatch<React.SetStateAction<ValueField[]>>;
  filters: string[];
  setFilters: React.Dispatch<React.SetStateAction<string[]>>;
}

const FieldsArea: React.FC<FieldsAreaProps> = ({ rows, setRows, columns, setColumns, values, setValues, filters, setFilters }) => {
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [draggedField, setDraggedField] = useState<string | null>(null);
  const [dragOverArea, setDragOverArea] = useState<string | null>(null);
  const assignedFields = new Set([...rows, ...columns, ...values.map(v => v.name), ...filters]);

  const handleFieldClick = (fieldName: string) => {
    if (!assignedFields.has(fieldName)) {
      setSelectedField(fieldName);
    }
  };

  // Drag events for fields
  const handleDragStart = (fieldName: string) => {
    setDraggedField(fieldName);
  };
  const handleDragEnd = () => {
    setDraggedField(null);
    setDragOverArea(null);
  };

  // Drop events for areas
  const handleDragOver = (area: string, e: React.DragEvent) => {
    e.preventDefault();
    setDragOverArea(area);
  };
  const handleDrop = (area: 'rows' | 'columns' | 'values' | 'filters') => {
    if (!draggedField || assignedFields.has(draggedField)) return;
    if (area === 'rows' && !rows.includes(draggedField)) setRows([...rows, draggedField]);
    if (area === 'columns' && !columns.includes(draggedField)) setColumns([...columns, draggedField]);
    if (area === 'values' && !values.some(v => v.name === draggedField)) setValues([...values, { name: draggedField, aggregation: 'Sum' }]);
    if (area === 'filters' && !filters.includes(draggedField)) setFilters([...filters, draggedField]);
    setDraggedField(null);
    setDragOverArea(null);
  };

  const assignField = (area: 'rows' | 'columns' | 'values' | 'filters') => {
    if (!selectedField) return;
    if (area === 'rows' && !rows.includes(selectedField)) setRows([...rows, selectedField]);
    if (area === 'columns' && !columns.includes(selectedField)) setColumns([...columns, selectedField]);
    if (area === 'values' && !values.some(v => v.name === selectedField)) setValues([...values, { name: selectedField, aggregation: 'Sum' }]);
    if (area === 'filters' && !filters.includes(selectedField)) setFilters([...filters, selectedField]);
    setSelectedField(null);
  };

  const removeField = (area: 'rows' | 'columns' | 'values' | 'filters', field: string) => {
    if (area === 'rows') setRows(rows.filter(f => f !== field));
    if (area === 'columns') setColumns(columns.filter(f => f !== field));
    if (area === 'values') setValues(values.filter(v => v.name !== field));
    if (area === 'filters') setFilters(filters.filter(f => f !== field));
  };

  const changeAggregation = (field: string, aggregation: string) => {
    setValues(values.map(v => v.name === field ? { ...v, aggregation } : v));
  };

  return (
    <div style={{ minWidth: 220, background: '#181818', color: '#e0e0e0', borderRadius: 8, boxShadow: '0 2px 8px #0004', padding: 16 }}>
      <h3 style={{ color: '#90caf9', marginBottom: 12 }}>Fields</h3>
      <ul style={{ listStyle: 'none', padding: 0, marginBottom: 16 }}>
        {mockFields.map(field => (
          <li
            key={field.name}
            draggable={!assignedFields.has(field.name)}
            onDragStart={() => handleDragStart(field.name)}
            onDragEnd={handleDragEnd}
            style={{
              padding: '8px 0',
              borderBottom: '1px solid #333',
              cursor: assignedFields.has(field.name) ? 'not-allowed' : 'grab',
              background: selectedField === field.name ? '#263238' : assignedFields.has(field.name) ? '#222' : draggedField === field.name ? '#37474f' : undefined,
              color: assignedFields.has(field.name) ? '#aaa' : '#e0e0e0',
              fontWeight: assignedFields.has(field.name) ? 'normal' : 'bold',
              transition: 'background 0.2s',
              opacity: draggedField === field.name ? 0.6 : 1,
            }}
            onClick={() => handleFieldClick(field.name)}
          >
            {field.name} <span style={{ color: '#80cbc4', fontSize: 12 }}>({field.type})</span>
            {assignedFields.has(field.name) && <span style={{ marginLeft: 8, color: '#d32f2f', fontSize: 12 }}>(assigned)</span>}
          </li>
        ))}
      </ul>
      <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Rows Area */}
        <div>
          <h4 style={{ color: '#90caf9', marginBottom: 4 }}>Rows</h4>
          <div
            style={{ minHeight: 32, background: dragOverArea === 'rows' ? '#263238' : '#222', border: '1px dashed #333', padding: 8, borderRadius: 4 }}
            onDragOver={e => handleDragOver('rows', e)}
            onDrop={() => handleDrop('rows')}
            onDragLeave={() => setDragOverArea(null)}
          >
            {rows.map(f => (
              <span key={f} style={{ display: 'block', marginBottom: 6, color: '#ffb300', fontWeight: 'bold' }}>
                {f} <button style={{ marginLeft: 2, background: '#263238', color: '#e0e0e0', border: 'none', borderRadius: 3, padding: '2px 8px', cursor: 'pointer' }} onClick={() => removeField('rows', f)}>Remove</button>
              </span>
            ))}
            {selectedField && <button style={{ background: '#263238', color: '#90caf9', border: 'none', borderRadius: 3, padding: '2px 8px', cursor: 'pointer' }} onClick={() => assignField('rows')}>Add</button>}
          </div>
        </div>
        {/* Columns Area */}
        <div>
          <h4 style={{ color: '#90caf9', marginBottom: 4 }}>Columns</h4>
          <div
            style={{ minHeight: 32, background: dragOverArea === 'columns' ? '#263238' : '#222', border: '1px dashed #333', padding: 8, borderRadius: 4 }}
            onDragOver={e => handleDragOver('columns', e)}
            onDrop={() => handleDrop('columns')}
            onDragLeave={() => setDragOverArea(null)}
          >
            {columns.map(f => (
              <span key={f} style={{ display: 'block', marginBottom: 6, color: '#ffb300', fontWeight: 'bold' }}>
                {f} <button style={{ marginLeft: 2, background: '#263238', color: '#e0e0e0', border: 'none', borderRadius: 3, padding: '2px 8px', cursor: 'pointer' }} onClick={() => removeField('columns', f)}>Remove</button>
              </span>
            ))}
            {selectedField && <button style={{ background: '#263238', color: '#90caf9', border: 'none', borderRadius: 3, padding: '2px 8px', cursor: 'pointer' }} onClick={() => assignField('columns')}>Add</button>}
          </div>
        </div>
        {/* Values Area */}
        <div>
          <h4 style={{ color: '#90caf9', marginBottom: 4 }}>Values</h4>
          <div
            style={{ minHeight: 32, background: dragOverArea === 'values' ? '#263238' : '#222', border: '1px dashed #333', padding: 8, borderRadius: 4 }}
            onDragOver={e => handleDragOver('values', e)}
            onDrop={() => handleDrop('values')}
            onDragLeave={() => setDragOverArea(null)}
          >
            {values.map(v => (
              <span key={v.name} style={{ display: 'block', marginBottom: 6, color: '#80cbc4', fontWeight: 'bold' }}>
                {v.name}
                <select style={{ marginLeft: 4, background: '#263238', color: '#e0e0e0', border: '1px solid #333', borderRadius: 3 }} value={v.aggregation} onChange={e => changeAggregation(v.name, e.target.value)}>
                  {aggregationOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <button style={{ marginLeft: 2, background: '#263238', color: '#e0e0e0', border: 'none', borderRadius: 3, padding: '2px 8px', cursor: 'pointer' }} onClick={() => removeField('values', v.name)}>Remove</button>
              </span>
            ))}
            {selectedField && <button style={{ background: '#263238', color: '#90caf9', border: 'none', borderRadius: 3, padding: '2px 8px', cursor: 'pointer' }} onClick={() => assignField('values')}>Add</button>}
          </div>
        </div>
        {/* Filters Area */}
        <div>
          <h4 style={{ color: '#90caf9', marginBottom: 4 }}>Filters</h4>
          <div
            style={{ minHeight: 32, background: dragOverArea === 'filters' ? '#263238' : '#222', border: '1px dashed #333', padding: 8, borderRadius: 4 }}
            onDragOver={e => handleDragOver('filters', e)}
            onDrop={() => handleDrop('filters')}
            onDragLeave={() => setDragOverArea(null)}
          >
            {filters.map(f => (
              <span key={f} style={{ display: 'block', marginBottom: 6, color: '#d32f2f', fontWeight: 'bold' }}>
                {f} <button style={{ marginLeft: 2, background: '#263238', color: '#e0e0e0', border: 'none', borderRadius: 3, padding: '2px 8px', cursor: 'pointer' }} onClick={() => removeField('filters', f)}>Remove</button>
              </span>
            ))}
            {selectedField && <button style={{ background: '#263238', color: '#90caf9', border: 'none', borderRadius: 3, padding: '2px 8px', cursor: 'pointer' }} onClick={() => assignField('filters')}>Add</button>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldsArea;
