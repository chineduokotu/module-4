import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Paper, Grid, Divider, Table, TableBody, TableCell,
    TableHead, TableRow, TableContainer, Chip
} from '@mui/material';
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton } from '@ionic/react';
import { useParams } from 'react-router-dom';
import { InvoiceService } from '../services/invoice.service';
import { Invoice } from '../types/invoice';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { StatusBadge } from '../components/StatusBadge';

const InvoiceDetail: React.FC = () => {
    const { invoiceId } = useParams<{ invoiceId: string }>();
    // Note: route param naming might vary. Using invoiceId based on setup.

    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (invoiceId) {
            InvoiceService.getInvoice(invoiceId).then(data => {
                setInvoice(data);
                setLoading(false);
            });
        }
    }, [invoiceId]);

    if (loading) return <Box p={3}><LoadingSkeleton /></Box>;
    if (!invoice) return <Box p={3}><Typography>Invoice not found</Typography></Box>;

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/customers" />
                    </IonButtons>
                    <IonTitle>Invoice {invoice.number}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <Box sx={{ p: 3, maxWidth: 900, margin: '0 auto' }}>
                    <Paper sx={{ p: 4 }}>
                        <Box display="flex" justifyContent="space-between" mb={3}>
                            <Box>
                                <Typography variant="h4" fontWeight="bold">INVOICE</Typography>
                                <Typography color="text.secondary">#{invoice.number}</Typography>
                            </Box>
                            <Box textAlign="right">
                                <StatusBadge status={invoice.status} />
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    Date: {new Date(invoice.date).toLocaleDateString()}
                                </Typography>
                                <Typography variant="body2">
                                    Due Date: {new Date(invoice.dueDate).toLocaleDateString()}
                                </Typography>
                            </Box>
                        </Box>

                        <Divider sx={{ mb: 3 }} />

                        <TableContainer sx={{ mb: 4 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Description</TableCell>
                                        <TableCell align="right">Quantity</TableCell>
                                        <TableCell align="right">Unit Price</TableCell>
                                        <TableCell align="right">Total</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {invoice.items.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>{item.description}</TableCell>
                                            <TableCell align="right">{item.quantity}</TableCell>
                                            <TableCell align="right">
                                                ${item.unitPrice.toFixed(2)}
                                            </TableCell>
                                            <TableCell align="right">
                                                ${item.total.toFixed(2)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Grid container justifyContent="flex-end">
                            <Grid item xs={12} sm={4}>
                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Typography>Subtotal:</Typography>
                                    <Typography>${invoice.subtotal.toFixed(2)}</Typography>
                                </Box>
                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Typography>Tax:</Typography>
                                    <Typography>${invoice.taxTotal.toFixed(2)}</Typography>
                                </Box>
                                <Divider sx={{ my: 1 }} />
                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Typography variant="h6">Total:</Typography>
                                    <Typography variant="h6">${invoice.totalAmount.toFixed(2)}</Typography>
                                </Box>
                                <Box display="flex" justifyContent="space-between" color="error.main">
                                    <Typography fontWeight="bold">Balance Due:</Typography>
                                    <Typography fontWeight="bold">${invoice.balance.toFixed(2)}</Typography>
                                </Box>
                            </Grid>
                        </Grid>

                        {invoice.allocations && invoice.allocations.length > 0 && (
                            <>
                                <Divider sx={{ my: 3 }} />
                                <Typography variant="h6" gutterBottom>Payment Allocations</Typography>
                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Date</TableCell>
                                                <TableCell>Reference</TableCell>
                                                <TableCell align="right">Amount</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {invoice.allocations.map((alloc, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{new Date(alloc.date).toLocaleDateString()}</TableCell>
                                                    <TableCell>{alloc.receiptReference}</TableCell>
                                                    <TableCell align="right">
                                                        ${alloc.amount.toFixed(2)}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </>
                        )}
                    </Paper>
                </Box >
            </IonContent>
        </IonPage>
    );
};

export default InvoiceDetail;
