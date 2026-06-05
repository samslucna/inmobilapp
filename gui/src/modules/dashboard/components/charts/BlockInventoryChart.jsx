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

export default function BlockInventoryChart({
    data
}) {

    return (
        <Card>
            <CardContent>

                <Typography
                    variant="h6"
                    gutterBottom
                >
                    Inventario por Manzana
                </Typography>

                <ResponsiveContainer
                    width="100%"
                    height={350}
                >
                    <BarChart
                        layout="vertical"
                        data={data}
                    >
                        <CartesianGrid strokeDasharray="3 3"/>

                        <XAxis type="number"/>

                        <YAxis
                            type="category"
                            dataKey="manzana"
                        />

                        <Tooltip/>

                        <Legend/>

                        <Bar
                            dataKey="disponibles"
                            fill="#f57c00"
                        />

                        <Bar
                            dataKey="vendidas"
                            fill="#43a047"
                        />

                    </BarChart>
                </ResponsiveContainer>

            </CardContent>
        </Card>
    );
}