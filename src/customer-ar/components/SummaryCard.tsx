import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface SummaryCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    color?: string; // Hex color or MUI theme color string
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, subtitle, color }) => {
    return (
        <Card sx={{ minWidth: 200, borderLeft: color ? `4px solid ${color}` : undefined }}>
            <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    {title}
                </Typography>
                <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                    {value}
                </Typography>
                {subtitle && (
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        {subtitle}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
};
