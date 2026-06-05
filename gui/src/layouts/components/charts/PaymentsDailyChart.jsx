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

export default function PaymentsDailyChart({
    data
}) {
    return (
        <Card>
            <CardContent>

                <Typography
                    variant="h6"
                    gutterBottom
                >
                    Pagos por Día
                </Typography>

                <ResponsiveContainer
                    width="100%"
                    height={300}
                >
                    <AreaChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="dia" />

                        <YAxis />

                        <Tooltip />

                        <Area
                            type="monotone"
                            dataKey="cantidad"
                            stroke="#0176d3"
                            fill="#0176d340"
                        />
                    </AreaChart>
                </ResponsiveContainer>

            </CardContent>
        </Card>
    );
}