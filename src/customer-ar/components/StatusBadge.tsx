import React from 'react';
import { Chip } from '@mui/material';

interface StatusBadgeProps {
    status: string | number;
}

const resolveStatus = (status: string | number | undefined | null): string => {
    if (status === undefined || status === null) return 'unknown';
    if (typeof status === 'number') {
        return status === 1 ? 'Active' : 'Inactive';
    }
    return status;
};

const getStatusColor = (status: string | number | undefined | null): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    const s = resolveStatus(status).toLowerCase();

    if (['active', 'paid', 'allocated'].includes(s)) return 'success';
    if (['inactive', 'void', 'blocked', 'overdue'].includes(s)) return 'error';
    if (['draft', 'unallocated', 'unknown'].includes(s)) return 'default';
    if (['sent', 'partially paid'].includes(s)) return 'warning';

    return 'default';
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const displayStatus = resolveStatus(status);

    return (
        <Chip
            label={displayStatus}
            color={getStatusColor(status)}
            size="small"
            variant="outlined"
            sx={{ fontWeight: 'bold' }}
        />
    );
};
