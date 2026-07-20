import { useState, useMemo } from "react";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    CartesianGrid,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";

import {
    Card,
    CardContent,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box
} from "@mui/material";

// Estructura base fija para garantizar los 12 meses de enero a diciembre
const MESES_NOMBRES = [
    "Ene", "Feb", "Mar", "Abr", "May", "Jun", 
    "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
];

export default function PaymentsMonthlyChart({ data }) {

    // 1. Obtener los años disponibles dinámicamente desde los datos
    const availableYears = useMemo(() => {
        const years = data.map(item => item.anio || new Date().getFullYear());
        return [...new Set(years)].sort((a, b) => b - a); // Ordenar de más reciente a antiguo
    }, [data]);

    // Estado para el año seleccionado (por defecto el más reciente o el actual)
    const [selectedYear, setSelectedYear] = useState(
        availableYears[0] || new Date().getFullYear()
    );

    // 2. Filtrar y formatear los datos para que siempre tengan los 12 meses
    const chartData = useMemo(() => {
        // Filtrar datos por el año seleccionado
        const filteredData = data.filter(item => (item.anio || item.year) === selectedYear);

        // Mapear los 12 meses asegurando que si no hay datos, pinte 0
        return MESES_NOMBRES.map((mesNombre, index) => {
            // Buscamos si en los datos del servidor existe este mes (asumiendo que viene como 1 para Ene, 2 para Feb...)
            // O si viene directamente con el nombre del mes, ajusta la condición.
            const monthRecord = filteredData.find(item => 
                item.mes_numero === (index + 1) || item.mes === mesNombre
            );

            return {
                mes: mesNombre,
                cantidad: monthRecord ? monthRecord.cantidad : 0
            };
        });
    }, [data, selectedYear]);

    return (
        <Card sx={{ width: '100%', boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
                
                {/* Cabecera con título y Selector de Año alineados */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h6" fontWeight="bold" color="text.primary">
                        Historial de Pagos
                    </Typography>
                    
                    {availableYears.length > 0 && (
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                            <InputLabel id="year-select-label">Año</InputLabel>
                            <Select
                                labelId="year-select-label"
                                value={selectedYear}
                                label="Año"
                                onChange={(e) => setSelectedYear(Number(e.target.value))}
                            >
                                {availableYears.map(year => (
                                    <MenuItem key={year} value={year}>
                                        {year}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                </Box>

                {/* Contenedor de la gráfica */}
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5"/>

                        <XAxis 
                            dataKey="mes" 
                            tick={{ fill: '#666', fontSize: 12 }}
                            axisLine={{ stroke: '#ccc' }}
                        />

                        <YAxis 
                            tick={{ fill: '#666', fontSize: 12 }}
                            axisLine={{ stroke: '#ccc' }}
                        />

                        <Tooltip 
                            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', borderColor: '#eee' }}
                            formatter={(value) => [`${value}`, 'Pagos']} // Formato de moneda opcional
                        />

                        <Area
                            type="monotone"
                            dataKey="cantidad"
                            stroke="#2e7d32"
                            fill="url(#colorCantidad)" // Sombreado degradado más estético
                            strokeWidth={2}
                        />
                        
                        {/* Definición de degradado para el área de la gráfica */}
                        <defs>
                            <linearGradient id="colorCantidad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2e7d32" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#2e7d32" stopOpacity={0.0}/>
                            </linearGradient>
                        </defs>
                    </AreaChart>
                </ResponsiveContainer>

            </CardContent>
        </Card>
    );
}