import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LegendPayload } from 'recharts';

// #region Sample data
const data = [
  {
    name: 'Etapa 1',
    Vendido: 4000,
    Pendiente: 2400,
    Disponible: 2400,
  },
  {
     name: 'Etapa 2',
    Vendido: 4000,
    Pendiente: 2400,
    Disponible: 2400,
  },
  {
      name: 'Etapa 3',
    Vendido: 4000,
    Pendiente: 2400,
    Disponible: 2400,
  },
  
];

// #endregion
const MixBarChart = () => {
  const [focusedDataKey, setFocusedDataKey] = useState(null);
  const [locked, setLocked] = useState(false);

  const onLegendMouseEnter = (payload: LegendPayload) => {
    if (!locked) {
      setFocusedDataKey(String(payload.dataKey));
    }
  };

  const onLegendMouseOut = () => {
    if (!locked) {
      setFocusedDataKey(null);
    }
  };

  const onLegendClick = (payload: LegendPayload) => {
    if (focusedDataKey === String(payload.dataKey)) {
      if (locked) {
        setFocusedDataKey(null);
        setLocked(false);
      } else {
        setLocked(true);
      }
    } else {
      setFocusedDataKey(String(payload.dataKey));
      setLocked(true);
    }
  };

  return (
    <BarChart
      style={{ width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618 }}
      responsive
      data={data}
      margin={{
        top: 20,
        right: 0,
        left: 0,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis width="auto" niceTicks="snap125" />
      <Tooltip />
      <Legend onMouseEnter={onLegendMouseEnter} onMouseOut={onLegendMouseOut} onClick={onLegendClick} />
      <Bar dataKey="Vendidos" stackId="a" fill={focusedDataKey == null || focusedDataKey === 'pv' ? '#eb4343' : '#eee'} />
      <Bar dataKey="Pendientes" stackId="a" fill={focusedDataKey == null || focusedDataKey === 'amt' ? '#df8d21' : '#eee'} />
      <Bar dataKey="Disponibles" fill={focusedDataKey == null || focusedDataKey === 'uv' ? '#17d136' : '#eee'} />
    
    </BarChart>
  );
};

export default MixBarChart;