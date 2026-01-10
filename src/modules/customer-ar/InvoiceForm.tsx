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
    IonIcon
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { add, trash } from 'ionicons/icons';
import axios from 'axios';
import {
    Box,
    TextField,
    Button,
    Typography,
    Divider,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from '@mui/material';

import { requestID, baseUrl, config, getSelectedBusiness } from '../../common/utils';

interface InvoiceItem {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

interface InvoiceFormProps {
    isModal?: boolean;
    onSuccess?: () => void;
    onCancel?: () => void;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ 
    isModal = false, 
    onSuccess,
    onCancel 
}) => {
    const history = useHistory();
    
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [customers, setCustomers] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        customer_id: '',
        invoice_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        notes: ''
    });

    const [items, setItems] = useState<InvoiceItem[]>([
        { description: '', quantity: 1, unitPrice: 0, total: 0 }
    ]);

    useEffect(() => {
        fetchCustomers();
    }, []);

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

    const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [field]: event.target.value }));
    };

    const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        
        // Calculate total
        if (field === 'quantity' || field === 'unitPrice') {
            newItems[index].total = newItems[index].quantity * newItems[index].unitPrice;
        }
        
        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { description: '', quantity: 1, unitPrice: 0, total: 0 }]);
    };

    const removeItem = (index: number) => {
        if (items.length > 1) {
            setItems(items.filter((_, i) => i !== index));
        }
    };

    const calculateSubtotal = () => {
        return items.reduce((sum, item) => sum + item.total, 0);
    };

    const calculateTax = () => {
        return calculateSubtotal() * 0.075; // 7.5% tax
    };

    const calculateTotal = () => {
        return calculateSubtotal() + calculateTax();
    };

    const handleSubmit = async () => {
        if (!formData.customer_id || items.some(item => !item.description)) {
            setToastMessage("Please fill in all required fields");
            setShowToast(true);
            return;
        }

        setLoading(true);
        try {
            const submitData = new FormData();
            submitData.append("requestID", requestID());
            submitData.append("customer_id", formData.customer_id);
            submitData.append("invoice_date", formData.invoice_date);
            submitData.append("due_date", formData.due_date);
            submitData.append("notes", formData.notes);
            submitData.append("items", JSON.stringify(items));
            submitData.append("subtotal", calculateSubtotal().toString());
            submitData.append("tax", calculateTax().toString());
            submitData.append("total", calculateTotal().toString());

            await axios.post(
                baseUrl() + "geacloud_invoices",
                submitData,
                config
            );

            setToastMessage("Invoice created successfully");
            setShowToast(true);
            setLoading(false);
            
            if (isModal && onSuccess) {
                setTimeout(() => {
                    onSuccess();
                }, 500);
            } else {
                setTimeout(() => {
                    history.push('/invoices');
                }, 1000);
            }

        } catch (error) {
            console.error("Error creating invoice:", error);
            setToastMessage("Failed to create invoice");
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
        <Box sx={{ p: 3, maxWidth: 900, mx: 'auto' }}>
            <IonLoading isOpen={loading} message="Please wait..." spinner="circles" />

            <IonToast
                isOpen={showToast}
                onDidDismiss={() => setShowToast(false)}
                message={toastMessage}
                duration={3000}
                position="bottom"
            />

            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, fontWeight: 600 }}>
                Invoice Information
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                    fullWidth
                    select
                    label="Customer"
                    value={formData.customer_id}
                    onChange={handleChange('customer_id')}
                    required
                    size="small"
                    SelectProps={{ native: true }}
                >
                    <option value="">Select Customer</option>
                    {customers.map((customer) => (
                        <option key={customer.id} value={customer.id}>
                            {customer.name} ({customer.customer_code})
                        </option>
                    ))}
                </TextField>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                    fullWidth
                    label="Invoice Date"
                    type="date"
                    value={formData.invoice_date}
                    onChange={handleChange('invoice_date')}
                    required
                    size="small"
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    fullWidth
                    label="Due Date"
                    type="date"
                    value={formData.due_date}
                    onChange={handleChange('due_date')}
                    required
                    size="small"
                    InputLabelProps={{ shrink: true }}
                />
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Line Items
                </Typography>
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<IonIcon icon={add} />}
                    onClick={addItem}
                >
                    Add Item
                </Button>
            </Box>

            <Table size="small" sx={{ mb: 2 }}>
                <TableHead>
                    <TableRow>
                        <TableCell>Description</TableCell>
                        <TableCell width="100px">Quantity</TableCell>
                        <TableCell width="120px">Unit Price</TableCell>
                        <TableCell width="120px">Total</TableCell>
                        <TableCell width="50px"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <TextField
                                    fullWidth
                                    value={item.description}
                                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                    placeholder="Item description"
                                    size="small"
                                />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                                    size="small"
                                    inputProps={{ min: 0 }}
                                />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    type="number"
                                    value={item.unitPrice}
                                    onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                                    size="small"
                                    inputProps={{ min: 0, step: 0.01 }}
                                />
                            </TableCell>
                            <TableCell>
                                ${item.total.toFixed(2)}
                            </TableCell>
                            <TableCell>
                                <IconButton
                                    size="small"
                                    onClick={() => removeItem(index)}
                                    disabled={items.length === 1}
                                >
                                    <IonIcon icon={trash} />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Box sx={{ width: 300 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography>Subtotal:</Typography>
                        <Typography>${calculateSubtotal().toFixed(2)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography>Tax (7.5%):</Typography>
                        <Typography>${calculateTax().toFixed(2)}</Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="h6">Total:</Typography>
                        <Typography variant="h6">${calculateTotal().toFixed(2)}</Typography>
                    </Box>
                </Box>
            </Box>

            <TextField
                fullWidth
                label="Notes"
                value={formData.notes}
                onChange={handleChange('notes')}
                multiline
                rows={3}
                size="small"
                sx={{ mb: 3 }}
            />

            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleSubmit}
                    sx={{ py: 1.2 }}
                >
                    Create Invoice
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
                        <IonTitle>New Invoice</IonTitle>
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
                        <IonBackButton defaultHref="/invoices" />
                    </IonButtons>
                    <IonTitle>New Invoice</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
                {formContent}
            </IonContent>
        </IonPage>
    );
};

export default InvoiceForm;
