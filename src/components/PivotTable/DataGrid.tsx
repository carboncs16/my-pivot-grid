// Main grid component
import React, { useState } from 'react';

interface ValueField {
  name: string;
  aggregation: string;
}

interface DataGridProps {
  rows: string[];
  columns: string[];
  values: ValueField[];
  filters: string[];
}

const mockData = [
  { Region: 'North', Product: 'Widget', Sales: 1200, Quantity: 10, Date: '2025-09-01', Category: 'A', Channel: 'Online', Discount: 5, Profit: 200 },
  { Region: 'North', Product: 'Gadget', Sales: 800, Quantity: 6, Date: '2025-09-02', Category: 'B', Channel: 'Retail', Discount: 10, Profit: 120 },
  { Region: 'North', Product: 'Widget', Sales: 1500, Quantity: 12, Date: '2025-09-03', Category: 'A', Channel: 'Online', Discount: 0, Profit: 300 },
  { Region: 'South', Product: 'Widget', Sales: 1100, Quantity: 9, Date: '2025-09-01', Category: 'C', Channel: 'Retail', Discount: 7, Profit: 180 },
  { Region: 'South', Product: 'Gadget', Sales: 900, Quantity: 7, Date: '2025-09-02', Category: 'B', Channel: 'Online', Discount: 12, Profit: 140 },
  { Region: 'South', Product: 'Widget', Sales: 1300, Quantity: 11, Date: '2025-09-03', Category: 'C', Channel: 'Retail', Discount: 3, Profit: 220 },
  { Region: 'East', Product: 'Widget', Sales: 1700, Quantity: 14, Date: '2025-09-01', Category: 'A', Channel: 'Online', Discount: 8, Profit: 350 },
  { Region: 'East', Product: 'Gadget', Sales: 950, Quantity: 8, Date: '2025-09-02', Category: 'B', Channel: 'Retail', Discount: 6, Profit: 160 },
  { Region: 'East', Product: 'Widget', Sales: 1600, Quantity: 13, Date: '2025-09-03', Category: 'A', Channel: 'Online', Discount: 4, Profit: 310 },
  { Region: 'West', Product: 'Gadget', Sales: 700, Quantity: 5, Date: '2025-09-01', Category: 'C', Channel: 'Retail', Discount: 15, Profit: 90 },
  { Region: 'West', Product: 'Widget', Sales: 1200, Quantity: 10, Date: '2025-09-02', Category: 'A', Channel: 'Online', Discount: 2, Profit: 210 },
  { Region: 'West', Product: 'Gadget', Sales: 850, Quantity: 6, Date: '2025-09-03', Category: 'B', Channel: 'Retail', Discount: 9, Profit: 130 },
  // Add more rows for volume
  ...Array.from({ length: 50 }, (_, i) => ({
    Region: ['North', 'South', 'East', 'West'][i % 4],
    Product: ['Widget', 'Gadget', 'Thingamajig'][i % 3],
    Sales: Math.floor(Math.random() * 2000 + 500),
    Quantity: Math.floor(Math.random() * 20 + 1),
    Date: `2025-09-${(i % 30) + 1}`,
    Category: ['A', 'B', 'C'][i % 3],
    Channel: ['Online', 'Retail', 'Wholesale'][i % 3],
    Discount: Math.floor(Math.random() * 20),
    Profit: Math.floor(Math.random() * 400 + 50)
  }))
];

function aggregate(data: any[], field: string, method: string) {
  if (method === 'Sum') return data.reduce((acc, row) => acc + (row[field] || 0), 0);
  if (method === 'Average') return data.length ? (data.reduce((acc, row) => acc + (row[field] || 0), 0) / data.length).toFixed(2) : 0;
  if (method === 'Count') return data.filter(row => row[field] !== undefined && row[field] !== null).length;
  return '';
}

function groupBy(data: any[], keys: string[]) {
  if (keys.length === 0) return [{ groupKey: null, items: data }];
  const groups: Record<string, any[]> = {};
  data.forEach(row => {
    const key = keys.map(k => row[k]).join('||');
    if (!groups[key]) groups[key] = [];
    groups[key].push(row);
  });
  return Object.entries(groups).map(([groupKey, items]) => ({ groupKey, items }));
}

function groupByRecursive(data: any[], keys: string[], depth = 0): any[] {
  if (keys.length === 0) return data;
  const [currentKey, ...restKeys] = keys;
  const groups: Record<string, any[]> = {};
  data.forEach(row => {
    const key = row[currentKey];
    if (!groups[key]) groups[key] = [];
    groups[key].push(row);
  });
  return Object.entries(groups).map(([groupValue, items]) => ({
    groupValue,
    depth,
    items: groupByRecursive(items, restKeys, depth + 1)
  }));
}

function isLeafGroup(group: any): boolean {
  // Leaf if items is an array and every item is an object (not a group)
  return Array.isArray(group.items) && group.items.length > 0 && typeof group.items[0] === 'object' && !('groupValue' in group.items[0]);
}

function flattenRows(groups: any[]): any[] {
  // Flatten all leaf data rows from nested groups
  let rows: any[] = [];
  groups.forEach(group => {
    if (isLeafGroup(group)) {
      rows = rows.concat(group.items);
    } else if (Array.isArray(group.items)) {
      rows = rows.concat(flattenRows(group.items));
    }
  });
  return rows;
}

const DataGrid: React.FC<DataGridProps> = ({ rows, columns, values }) => {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const selectedFields = [...rows, ...columns, ...values.map(v => v.name)];
  const displayFields = selectedFields.length > 0 ? selectedFields : Object.keys(mockData[0]);
  const valueFields = values.map(v => v.name);

  const groupedData = groupByRecursive(mockData, rows);

  const toggleGroup = (groupPath: string) => {
    setExpandedGroups(prev => ({ ...prev, [groupPath]: !prev[groupPath] }));
  };

  function renderGroups(groups: any[], parentPath = '', parentLabels: string[] = []) {
    return groups.filter(group => group.items && group.items.length > 0).map((group, gIdx) => {
      const groupPath = parentPath + group.groupValue + '_' + group.depth;
      const isExpanded = expandedGroups[groupPath];
      const isLeaf = isLeafGroup(group);
      const labels = [...parentLabels, group.groupValue];
      return (
        <React.Fragment key={groupPath}>
          <tr style={{ background: '#263238', cursor: isLeaf ? undefined : 'pointer' }}>
            <td style={{ textAlign: 'left', border: '1px solid #333', color: '#ffb300', fontWeight: 'bold', fontSize: 16, paddingLeft: group.depth * 24 }} onClick={() => !isLeaf && toggleGroup(groupPath)}>
              {!isLeaf ? (isExpanded ? '▼ ' : '▶ ') : ''}
              {labels[labels.length - 1]}
            </td>
            {valueFields.map((key, i) => {
              const valueField = values.find(v => v.name === key)!;
              const dataRows = isLeaf ? group.items : flattenRows(group.items);
              return <td key={i} style={{ border: '1px solid #333', padding: '6px', fontWeight: 'bold', color: '#80cbc4' }}>
                {aggregate(dataRows, valueField.name, valueField.aggregation)}
              </td>;
            })}
          </tr>
          {isExpanded && !isLeaf && group.items?.length > 0 && renderGroups(group.items, groupPath, labels)}
          {isLeaf && isExpanded && group.items.length > 0 && group.items.map((row: any, idx: number) => (
            <tr key={idx} style={{ background: '#212121' }}>
              <td style={{ border: '1px solid #333', paddingLeft: (group.depth + 1) * 24 }}>
                {/* Show leaf label if last row field exists */}
                {labels.length < rows.length ? null : row[rows[rows.length - 1]]}
              </td>
              {valueFields.map((key, i) => (
                <td key={i} style={{ border: '1px solid #333', padding: '6px', color: '#e0e0e0' }}>{row[key]}</td>
              ))}
            </tr>
          ))}
        </React.Fragment>
      );
    });
  }

  return (
    <div style={{ minWidth: 400, background: '#181818', color: '#e0e0e0', borderRadius: 8, boxShadow: '0 2px 8px #0004' }}>
      <h3 style={{ color: '#90caf9' }}>Data Grid</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#222' }}>
        <thead>
          <tr>
            <th style={{ width: 200, border: '1px solid #333', background: '#263238', textAlign: 'left' }}>Hierarchy</th>
            {valueFields.map(key => (
              <th key={key} style={{ border: '1px solid #333', padding: '6px', background: '#263238', color: '#90caf9' }}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {renderGroups(groupedData)}
        </tbody>
      </table>
      {values.length > 0 && <div style={{ marginTop: 8, fontSize: 13, color: '#90caf9' }}><b>Aggregated row</b> shows the selected aggregation for each value field in each group. Click a group to expand/collapse.</div>}
    </div>
  );
};

export default DataGrid;
