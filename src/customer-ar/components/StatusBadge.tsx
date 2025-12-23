import React from 'react';
import { Chip } from '@mui/material';

interface StatusBadgeProps {
    status: string;
}

const getStatusColor = (status: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    const s = status.toLowerCase();
    if (['active', 'paid', 'allocated'].includes(s)) return 'success';
    if (['inactive', 'void', 'blocked', 'overdue'].includes(s)) return 'error';
    if (['draft', 'unallocated'].includes(s)) return 'default';
    if (['sent', 'partially paid'].includes(s)) return 'warning';
    return 'default';
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    return (
        <Chip
            label={status}
            color={getStatusColor(status)}
            size="small"
            variant="outlined"
            sx={{ fontWeight: 'bold' }}
        />
    );
};
