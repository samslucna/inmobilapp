import React, {  useEffect } from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';
import ClientStore from '../../store/ClientStore';

const Spinner = ({message}) => {
  useEffect(() => {
    // Simulando una carga de datos de 3 segundos
    const timer = setTimeout(() => {
      ClientStore.setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (ClientStore.loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
        }}
      >
        <CircularProgress thickness={4} />
        <Typography >{message}</Typography>
      </Box>
    );
  }

  return <div>¡Datos cargados con éxito!</div>;
};

export default Spinner;