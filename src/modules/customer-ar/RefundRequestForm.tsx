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
    IonToast
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import {
    Box,
    TextField,
    Button,
    Typography,
    MenuItem
} from '@mui/material';

import { requestID, baseUrl, config } from '../../common/utils';

interface RefundRequestFormProps {
    isModal?: boolean;
    invoiceId?: string | null;
    onSuccess?: () => void;
    onCancel?: () => void;
}

const RefundRequestForm: React.FC<RefundRequestFormProps> = ({ 
    isModal = false,
    invoiceId: propInvoiceId = null,
    onSuccess,
    onCancel 
}) => {
    const history = useHistory();
    
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [customers, setCustomers] = useState<any[]>([]);
    const [invoices, setInvoices] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        customer_id: '',
        invoice_id: propInvoiceId || '',
        amount: '',
        reason: '',
        refund_method: 'bank_transfer'
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
                setInvoices(data);
            }
        } catch (error) {
            console.error("Error fetching invoices:", error);
        }
    };

    const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [field]: event.target.value }));
    };

    const handleSubmit = async () => {
        if (!formData.customer_id || !formData.invoice_id || !formData.amount || !formData.reason) {
            setToastMessage("Please fill in all required fields");
            setShowToast(true);
            return;
        }

        setLoading(true);
        try {
            const submitData = new FormData();
            submitData.append("requestID", requestID());
            submitData.append("customer_id", formData.customer_id);
            submitData.append("invoice_id", formData.invoice_id);
            submitData.append("amount", formData.amount);
            submitData.append("reason", formData.reason);
            submitData.append("refund_method", formData.refund_method);

            await axios.post(
                baseUrl() + "geacloud_workflows/refund",
                submitData,
                config
            );

            setToastMessage("Refund request submitted successfully");
            setShowToast(true);
            setLoading(false);
            
            if (isModal && onSuccess) {
                setTimeout(() => {
                    onSuccess();
                }, 500);
            } else {
                setTimeout(() => {
                    history.push('/workflows');
                }, 1000);
            }

        } catch (error) {
            console.error("Error submitting refund request:", error);
            setToastMessage("Failed to submit refund request");
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
        <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
            <IonLoading isOpen={loading} message="Please wait..." spinner="circles" />

            <IonToast
                isOpen={showToast}
                onDidDismiss={() => setShowToast(false)}
                message={toastMessage}
                duration={3000}
                position="bottom"
            />

            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, fontWeight: 600 }}>
                Refund Request Information
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
            >
                <option value="">Select Customer</option>
                {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                        {customer.name} ({customer.customer_code})
                    </option>
                ))}
            </TextField>

            <TextField
                fullWidth
                select
                label="Invoice"
                value={formData.invoice_id}
                onChange={handleChange('invoice_id')}
                required
                size="small"
                sx={{ mb: 2 }}
                SelectProps={{ native: true }}
                disabled={!formData.customer_id || !!propInvoiceId}
            >
                <option value="">Select Invoice</option>
                {invoices.map((invoice) => (
                    <option key={invoice.id} value={invoice.id}>
                        Invoice #{invoice.number} - ${invoice.totalAmount}
                    </option>
                ))}
            </TextField>

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                    fullWidth
                    label="Refund Amount"
                    type="number"
                    value={formData.amount}
                    onChange={handleChange('amount')}
                    required
                    size="small"
                    inputProps={{ min: 0, step: 0.01 }}
                />
                <TextField
                    fullWidth
                    select
                    label="Refund Method"
                    value={formData.refund_method}
                    onChange={handleChange('refund_method')}
                    size="small"
                >
                    <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                    <MenuItem value="cash">Cash</MenuItem>
                    <MenuItem value="cheque">Cheque</MenuItem>
                    <MenuItem value="credit_note">Credit Note</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                </TextField>
            </Box>

            <TextField
                fullWidth
                label="Reason for Refund"
                value={formData.reason}
                onChange={handleChange('reason')}
                required
                multiline
                rows={4}
                size="small"
                sx={{ mb: 3 }}
                placeholder="Please provide a detailed reason for the refund request..."
            />

            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleSubmit}
                    sx={{ py: 1.2 }}
                >
                    Submit Refund Request
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
                        <IonTitle>Refund Request</IonTitle>
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
                        <IonBackButton defaultHref="/workflows" />
                    </IonButtons>
                    <IonTitle>Refund Request</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
                {formContent}
            </IonContent>
        </IonPage>
    );
};

export default RefundRequestForm;
