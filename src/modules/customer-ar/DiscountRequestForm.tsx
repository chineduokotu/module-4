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

interface DiscountRequestFormProps {
    isModal?: boolean;
    invoiceId?: string | null;
    onSuccess?: () => void;
    onCancel?: () => void;
}

const DiscountRequestForm: React.FC<DiscountRequestFormProps> = ({ 
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
        discount_type: 'percentage',
        discount_value: '',
        reason: ''
    });

    const [calculatedAmount, setCalculatedAmount] = useState(0);
    const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

    useEffect(() => {
        fetchCustomers();
    }, []);

    useEffect(() => {
        if (formData.customer_id) {
            fetchCustomerInvoices(formData.customer_id);
        }
    }, [formData.customer_id]);

    useEffect(() => {
        calculateDiscount();
    }, [formData.discount_type, formData.discount_value, selectedInvoice]);

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

    const calculateDiscount = () => {
        if (!selectedInvoice || !formData.discount_value) {
            setCalculatedAmount(0);
            return;
        }

        const value = parseFloat(formData.discount_value);
        if (formData.discount_type === 'percentage') {
            setCalculatedAmount((selectedInvoice.balance * value) / 100);
        } else {
            setCalculatedAmount(value);
        }
    };

    const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setFormData(prev => ({ ...prev, [field]: value }));

        if (field === 'invoice_id') {
            const invoice = invoices.find(inv => inv.id === value);
            setSelectedInvoice(invoice);
        }
    };

    const handleSubmit = async () => {
        if (!formData.customer_id || !formData.invoice_id || !formData.discount_value || !formData.reason) {
            setToastMessage("Please fill in all required fields");
            setShowToast(true);
            return;
        }

        if (calculatedAmount > selectedInvoice?.balance) {
            setToastMessage("Discount amount cannot exceed invoice balance");
            setShowToast(true);
            return;
        }

        setLoading(true);
        try {
            const submitData = new FormData();
            submitData.append("requestID", requestID());
            submitData.append("customer_id", formData.customer_id);
            submitData.append("invoice_id", formData.invoice_id);
            submitData.append("discount_type", formData.discount_type);
            submitData.append("discount_value", formData.discount_value);
            submitData.append("discount_amount", calculatedAmount.toString());
            submitData.append("reason", formData.reason);

            await axios.post(
                baseUrl() + "geacloud_workflows/discount",
                submitData,
                config
            );

            setToastMessage("Discount request submitted successfully");
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
            console.error("Error submitting discount request:", error);
            setToastMessage("Failed to submit discount request");
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
                Discount Request Information
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
                        Invoice #{invoice.number} - Balance: ${invoice.balance}
                    </option>
                ))}
            </TextField>

            {selectedInvoice && (
                <Box sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography variant="body2">
                        Invoice Total: <strong>${selectedInvoice.totalAmount?.toLocaleString()}</strong>
                    </Typography>
                    <Typography variant="body2">
                        Current Balance: <strong>${selectedInvoice.balance?.toLocaleString()}</strong>
                    </Typography>
                </Box>
            )}

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                    fullWidth
                    select
                    label="Discount Type"
                    value={formData.discount_type}
                    onChange={handleChange('discount_type')}
                    size="small"
                >
                    <MenuItem value="percentage">Percentage (%)</MenuItem>
                    <MenuItem value="fixed">Fixed Amount ($)</MenuItem>
                </TextField>
                <TextField
                    fullWidth
                    label={formData.discount_type === 'percentage' ? 'Percentage' : 'Amount'}
                    type="number"
                    value={formData.discount_value}
                    onChange={handleChange('discount_value')}
                    required
                    size="small"
                    inputProps={{ 
                        min: 0, 
                        max: formData.discount_type === 'percentage' ? 100 : undefined,
                        step: formData.discount_type === 'percentage' ? 1 : 0.01
                    }}
                />
            </Box>

            {calculatedAmount > 0 && (
                <Box sx={{ mb: 2, p: 2, bgcolor: '#e3f2fd', borderRadius: 1 }}>
                    <Typography variant="body2" color="primary">
                        Calculated Discount Amount: <strong>${calculatedAmount.toFixed(2)}</strong>
                    </Typography>
                    <Typography variant="body2" color="primary">
                        New Balance: <strong>${(selectedInvoice?.balance - calculatedAmount).toFixed(2)}</strong>
                    </Typography>
                </Box>
            )}

            <TextField
                fullWidth
                label="Reason for Discount"
                value={formData.reason}
                onChange={handleChange('reason')}
                required
                multiline
                rows={4}
                size="small"
                sx={{ mb: 3 }}
                placeholder="Please provide a detailed reason for the discount request..."
            />

            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleSubmit}
                    sx={{ py: 1.2 }}
                >
                    Submit Discount Request
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
                        <IonTitle>Discount Request</IonTitle>
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
                    <IonTitle>Discount Request</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
                {formContent}
            </IonContent>
        </IonPage>
    );
};

export default DiscountRequestForm;
