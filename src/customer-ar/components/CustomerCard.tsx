import React from 'react';
import { Card, CardContent, Typography, Grid, Divider, Box } from '@mui/material';
import { Customer } from '../types/customer';
import { StatusBadge } from './StatusBadge';

interface CustomerCardProps {
    customer: Customer;
}

export const CustomerCard: React.FC<CustomerCardProps> = ({ customer }) => {
    return (
        <Card>
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">{customer.name}</Typography>
                    <StatusBadge status={customer.status} />
                </Box>
                <Typography color="text.secondary" gutterBottom>
                    Code: {customer.code}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Contact Person</Typography>
                        <Typography variant="body1">{customer.contactPerson || '-'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Email</Typography>
                        <Typography variant="body1">{customer.email || '-'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Phone</Typography>
                        <Typography variant="body1">{customer.phone || '-'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Currency</Typography>
                        <Typography variant="body1">{customer.currency}</Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};
