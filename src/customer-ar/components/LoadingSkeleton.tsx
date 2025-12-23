import React from 'react';
import { Box, Skeleton } from '@mui/material';

export const LoadingSkeleton: React.FC = () => {
    return (
        <Box sx={{ width: '100%' }}>
            <Skeleton variant="rectangular" width="100%" height={118} sx={{ mb: 2 }} />
            <Skeleton width="60%" />
            <Skeleton width="40%" />
            <Skeleton variant="rectangular" width="100%" height={60} sx={{ mt: 2 }} />
            <Skeleton variant="rectangular" width="100%" height={60} sx={{ mt: 1 }} />
        </Box>
    );
};
