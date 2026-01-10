import React, { useState, useEffect } from 'react';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonButton,
    IonLoading,
    IonToast,
    IonList,
    IonItem,
    IonLabel,
    IonCheckbox
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import {
    Box,
    TextField,
    Button,
    Typography,
    Divider,
    MenuItem
} from '@mui/material';

import { requestID, baseUrl, config } from '../../common/utils';

interface Invoice {
    id: string;
    number: string;
    balance: number;
    totalAmount: number;
}

interface PaymentFormProps {
    isModal?: boolean;
    customerId?: string | null;
    onSuccess?: () => void;
    onCancel?: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ 
    isModal = false,
    customerId: propCustomerId = null,
    onSuccess,
    onCancel 
}) => {
    const history = useHistory();
    
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [customers, setCustomers] = useState<any[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [selectedInvoices, setSelectedInvoices] = useState<{[key: string]: number}>({});

    const [formData, setFormData] = useState({
        customer_id: propCustomerId || '',
        payment_date: new Date().toISOString().split('T')[0],
        payment_method: 'cash',
        reference: '',
        amount: '0',
        notes: ''
    });

    useEffect(() => {
        fetchCustomers();
    }, []);

    useEffect(() => {
        if (formData.customer_id) {
            fetchCustomerInvoices(formData.customer_id);
        }
    }, [formData.customer_id]);

    const fetchCustomers = async () => {
        try {
            const formDataReq = new FormData();
            formDataReq.append("requestID", requestID());

            const response = await axios.post(
                baseUrl() + "Geacloud_Customers",
                formDataReq,
                config
            );

            const { data } = response.data;
            if (data && Array.isArray(data)) {
                setCustomers(data);
            }
        } catch (error) {
            console.error("Error fetching customers:", error);
        }
    };

    const fetchCustomerInvoices = async (customer_id: string) => {
        try {
            const formDataReq = new FormData();
            formDataReq.append("requestID", requestID());
            formDataReq.append("customer_id", customer_id);

            const response = await axios.post(
                baseUrl() + "geacloud_invoices",
                formDataReq,
                config
            );

            const { data } = response.data;
            if (data && Array.isArray(data)) {
                // Filter unpaid invoices
                const unpaidInvoices = data.filter(inv => inv.balance > 0);
                setInvoices(unpaidInvoices);
            }
        } catch (error) {
            console.error("Error fetching invoices:", error);
        }
    };

    const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [field]: event.target.value }));
    };

    const toggleInvoice = (invoiceId: string, balance: number) => {
        setSelectedInvoices(prev => {
            const newSelected = { ...prev };
            if (newSelected[invoiceId]) {
                delete newSelected[invoiceId];
            } else {
                newSelected[invoiceId] = balance;
            }
            return newSelected;
        });
    };

    const updateAllocation = (invoiceId: string, amount: number) => {
        setSelectedInvoices(prev => ({
            ...prev,
            [invoiceId]: amount
        }));
    };

    const getTotalAllocated = () => {
        return Object.values(selectedInvoices).reduce((sum, amt) => sum + amt, 0);
    };

    const getRemainingAmount = () => {
        return parseFloat(formData.amount || '0') - getTotalAllocated();
    };

    const handleSubmit = async () => {
        if (!formData.customer_id || !formData.amount || parseFloat(formData.amount) <= 0) {
            setToastMessage("Please fill in all required fields");
            setShowToast(true);
            return;
        }

        setLoading(true);
        try {
            // Step 1: Record payment
            const paymentData = new FormData();
            paymentData.append("requestID", requestID());
            paymentData.append("customer_id", formData.customer_id);
            paymentData.append("payment_date", formData.payment_date);
            paymentData.append("payment_method", formData.payment_method);
            paymentData.append("reference", formData.reference);
            paymentData.append("amount", formData.amount);
            paymentData.append("notes", formData.notes);

            const paymentResponse = await axios.post(
                baseUrl() + "geacloud_receipts",
                paymentData,
                config
            );

            const { data: paymentResult } = paymentResponse.data;
            const receiptId = paymentResult?.id || paymentResult?.receipt_id;

            // Step 2: Allocate to invoices if any selected
            if (Object.keys(selectedInvoices).length > 0 && receiptId) {
                const allocationData = new FormData();
                allocationData.append("requestID", requestID());
                allocationData.append("receipt_id", receiptId);
                allocationData.append("allocations", JSON.stringify(
                    Object.entries(selectedInvoices).map(([invoice_id, amount]) => ({
                        invoice_id,
                        amount
                    }))
                ));

                await axios.post(
                    baseUrl() + "geacloud_receipts/allocate",
                    allocationData,
                    config
                );
            }

            setToastMessage("Payment recorded successfully");
            setShowToast(true);
            setLoading(false);
            
            if (isModal && onSuccess) {
                setTimeout(() => {
                    onSuccess();
                }, 500);
            } else {
                setTimeout(() => {
                    history.goBack();
                }, 1000);
            }

        } catch (error) {
            console.error("Error recording payment:", error);
            setToastMessage("Failed to record payment");
            setShowToast(true);
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (isModal && onCancel) {
            onCancel();
        } else {
            history.goBack();
        }
    };

    const formContent = (
        <Box sx={{ p: 3, maxWidth: 700, mx: 'auto' }}>
            <IonLoading isOpen={loading} message="Please wait..." spinner="circles" />

            <IonToast
                isOpen={showToast}
                onDidDismiss={() => setShowToast(false)}
                message={toastMessage}
                duration={3000}
                position="bottom"
            />

            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, fontWeight: 600 }}>
                Payment Information
            </Typography>

            <TextField
                fullWidth
                select
                label="Customer"
                value={formData.customer_id}
                onChange={handleChange('customer_id')}
                required
                size="small"
                sx={{ mb: 2 }}
                SelectProps={{ native: true }}
                disabled={!!propCustomerId}
            >
                <option value="">Select Customer</option>
                {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                        {customer.name} ({customer.customer_code})
                    </option>
                ))}
            </TextField>

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                    fullWidth
                    label="Payment Date"
                    type="date"
                    value={formData.payment_date}
                    onChange={handleChange('payment_date')}
                    required
                    size="small"
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    fullWidth
                    label="Amount"
                    type="number"
                    value={formData.amount}
                    onChange={handleChange('amount')}
                    required
                    size="small"
                    inputProps={{ min: 0, step: 0.01 }}
                />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                    fullWidth
                    select
                    label="Payment Method"
                    value={formData.payment_method}
                    onChange={handleChange('payment_method')}
                    size="small"
                >
                    <MenuItem value="cash">Cash</MenuItem>
                    <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                    <MenuItem value="cheque">Cheque</MenuItem>
                    <MenuItem value="card">Card</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                </TextField>
                <TextField
                    fullWidth
                    label="Reference"
                    value={formData.reference}
                    onChange={handleChange('reference')}
                    size="small"
                    placeholder="e.g., Cheque #, Transaction ID"
                />
            </Box>

            <TextField
                fullWidth
                label="Notes"
                value={formData.notes}
                onChange={handleChange('notes')}
                multiline
                rows={2}
                size="small"
                sx={{ mb: 3 }}
            />

            <Divider sx={{ my: 3 }} />

            {formData.customer_id && invoices.length > 0 && (
                <>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, fontWeight: 600 }}>
                        Allocate to Invoices (Optional)
                    </Typography>

                    <Box sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                        <Typography variant="body2">
                            Payment Amount: <strong>${parseFloat(formData.amount || '0').toFixed(2)}</strong>
                        </Typography>
                        <Typography variant="body2">
                            Allocated: <strong>${getTotalAllocated().toFixed(2)}</strong>
                        </Typography>
                        <Typography variant="body2" color={getRemainingAmount() < 0 ? 'error' : 'text.secondary'}>
                            Remaining: <strong>${getRemainingAmount().toFixed(2)}</strong>
                        </Typography>
                    </Box>

                    <IonList>
                        {invoices.map((invoice) => (
                            <IonItem key={invoice.id}>
                                <IonCheckbox
                                    slot="start"
                                    checked={!!selectedInvoices[invoice.id]}
                                    onIonChange={() => toggleInvoice(invoice.id, invoice.balance)}
                                />
                                <IonLabel>
                                    <h3>Invoice #{invoice.number}</h3>
                                    <p>Balance: ${invoice.balance.toFixed(2)}</p>
                                </IonLabel>
                                {selectedInvoices[invoice.id] !== undefined && (
                                    <TextField
                                        type="number"
                                        size="small"
                                        value={selectedInvoices[invoice.id]}
                                        onChange={(e) => updateAllocation(invoice.id, parseFloat(e.target.value) || 0)}
                                        inputProps={{ min: 0, max: invoice.balance, step: 0.01 }}
                                        sx={{ width: 120 }}
                                    />
                                )}
                            </IonItem>
                        ))}
                    </IonList>
                </>
            )}

            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleSubmit}
                    sx={{ py: 1.2 }}
                    disabled={getRemainingAmount() < 0}
                >
                    Record Payment
                </Button>
                <Button
                    variant="outlined"
                    fullWidth
                    onClick={handleCancel}
                    sx={{ py: 1.2 }}
                >
                    Cancel
                </Button>
            </Box>
        </Box>
    );

    if (isModal) {
        return (
            <>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Record Payment</IonTitle>
                        <IonButtons slot="end">
                            <IonButton onClick={handleCancel}>
                                Close
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen>
                    {formContent}
                </IonContent>
            </>
        );
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/customers" />
                    </IonButtons>
                    <IonTitle>Record Payment</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
                {formContent}
            </IonContent>
        </IonPage>
    );
};

export default PaymentForm;
