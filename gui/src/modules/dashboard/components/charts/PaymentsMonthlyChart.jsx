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
    Typography
} from "@mui/material";

export default function PaymentsMonthlyChart({
    data
}) {
    return (
        <Card>
            <CardContent>

                <Typography
                    variant="h6"
                    gutterBottom
                >
                    Pagos por Mes
                </Typography>

                <ResponsiveContainer
                    width="100%"
                    height={300}
                >
                    <AreaChart data={data}>
                        <CartesianGrid strokeDasharray="3 3"/>

                        <XAxis dataKey="mes"/>

                        <YAxis/>

                        <Tooltip/>

                        <Area
                            type="monotone"
                            dataKey="cantidad"
                            stroke="#2e7d32"
                            fill="#2e7d3240"
                        />
                    </AreaChart>
                </ResponsiveContainer>

            </CardContent>
        </Card>
    );
}