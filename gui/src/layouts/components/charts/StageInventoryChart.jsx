import {
    ResponsiveContainer,
    BarChart,
    Bar,
    CartesianGrid,
    Tooltip,
    XAxis,
    YAxis,
    Legend
} from "recharts";

import {
    Card,
    CardContent,
    Typography
} from "@mui/material";

export default function StageInventoryChart({
    data
}) {
    return (
        <Card>
            <CardContent>

                <Typography
                    variant="h6"
                    gutterBottom
                >
                    Inventario por Etapa
                </Typography>

                <ResponsiveContainer
                    width="100%"
                    height={350}
                >
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3"/>

                        <XAxis dataKey="etapa"/>

                        <YAxis/>

                        <Tooltip/>

                        <Legend/>

                        <Bar
                            dataKey="disponibles"
                            fill="#0288d1"
                        />

                        <Bar
                            dataKey="vendidas"
                            fill="#2e7d32"
                        />

                    </BarChart>
                </ResponsiveContainer>

            </CardContent>
        </Card>
    );
}