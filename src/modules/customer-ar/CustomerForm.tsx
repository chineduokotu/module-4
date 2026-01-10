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
import { useParams, useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
    Box,
    TextField,
    MenuItem,
    Button,
    Typography,
    Divider
} from '@mui/material';

import { requestID, baseUrl, config } from '../../common/utils';

// Customer interface for state transfer
interface Customer {
    id: number;
    customer_code?: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    contact_person: string;
    status?: number;
    credit_limit: string;
    current_balance?: string;
    classification_id?: string;
}

// Location state interface for Boss's Pattern
interface LocationState {
    customer?: Customer;
}

interface CustomerFormProps {
    isModal?: boolean;
    customerId?: string | null;
    customerData?: Customer | null; // State Transfer: receive customer object directly
    onSuccess?: () => void;
    onCancel?: () => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ 
    isModal = false, 
    customerId: propCustomerId = null,
    customerData: propCustomerData = null,
    onSuccess,
    onCancel 
}) => {
    const params = useParams<{ id: string }>();
    const history = useHistory();
    const location = useLocation<LocationState>(); // Boss's Pattern: useLocation with Generics
    
    // Use prop customerId if in modal mode, otherwise use route params
    const id = isModal ? propCustomerId : params.id;
    const isEdit = Boolean(id);
    
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        classification_id: '1',
        address: '',
        city: '',
        state: '',
        contact_person: '',
        credit_limit: '0'
    });

    useEffect(() => {
        if (isEdit && id) {
            // Boss's Pattern: Check state transfer first, then fallback to API
            const customerFromState = isModal ? propCustomerData : location.state?.customer;
            
            if (customerFromState) {
                // State Transfer: Use data directly, skip API call
                console.log('Using state transfer - skipping API call');
                setFormData({
                    name: customerFromState.name || '',
                    email: customerFromState.email || '',
                    phone: customerFromState.phone || '',
                    classification_id: customerFromState.classification_id?.toString() || '1',
                    address: customerFromState.address || '',
                    city: customerFromState.city || '',
                    state: customerFromState.state || '',
                    contact_person: customerFromState.contact_person || '',
                    credit_limit: customerFromState.credit_limit || '0'
                });
            } else {
                // Fallback: API call (e.g., user refreshed the page)
                console.log('No state transfer - fetching from API');
                fetchCustomer();
            }
        } else {
            // Reset form when opening for new customer
            setFormData({
                name: '',
                email: '',
                phone: '',
                classification_id: '1',
                address: '',
                city: '',
                state: '',
                contact_person: '',
                credit_limit: '0'
            });
        }
    }, [isEdit, id, propCustomerData]);

    // Boss's Pattern: axios.post with FormData for API fallback
    const fetchCustomer = async () => {
        setLoading(true);
        try {
            const formDataReq = new FormData();
            formDataReq.append("requestID", requestID());
            formDataReq.append("customer_id", id!);

            const response = await axios.post(
                baseUrl() + "Geacloud_Customers",
                formDataReq,
                config
            );

            console.log({ response });
            const { data } = response.data;

            if (data) {
                setFormData({
                    name: data.name || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    classification_id: data.classification_id?.toString() || '1',
                    address: data.address || '',
                    city: data.city || '',
                    state: data.state || '',
                    contact_person: data.contact_person || '',
                    credit_limit: data.credit_limit || '0'
                });
            }

            setLoading(false);
        } catch (error) {
            console.error("Error fetching customer:", error);
            setToastMessage("Failed to load customer");
            setShowToast(true);
            setLoading(false);
        }
    };

    const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [field]: event.target.value }));
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.email || !formData.phone) {
            setToastMessage("Please fill in all required fields");
            setShowToast(true);
            return;
        }

        setLoading(true);
        try {
            const submitData = new FormData();
            submitData.append("requestID", requestID());
            submitData.append("name", formData.name);
            submitData.append("email", formData.email);
            submitData.append("phone", formData.phone);
            submitData.append("classification_id", formData.classification_id);
            submitData.append("address", formData.address);
            submitData.append("city", formData.city);
            submitData.append("state", formData.state);
            submitData.append("contact_person", formData.contact_person);
            submitData.append("credit_limit", formData.credit_limit);

            if (isEdit && id) {
                submitData.append("customer_id", id);
                await axios.post(
                    baseUrl() + "Geacloud_Customers",
                    submitData,
                    config
                );
                setToastMessage("Customer updated successfully");
            } else {
                await axios.post(
                    baseUrl() + "Geacloud_Customers",
                    submitData,
                    config
                );
                setToastMessage("Customer created successfully");
            }

            setShowToast(true);
            setLoading(false);
            
            // Handle success based on mode
            if (isModal && onSuccess) {
                setTimeout(() => {
                    onSuccess();
                }, 500);
            } else {
                setTimeout(() => {
                    history.push('/customers');
                }, 1000);
            }

        } catch (error) {
            console.error("Error saving customer:", error);
            setToastMessage("Failed to save customer");
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

    // Form content with Material UI styling
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

            {/* Basic Information Section */}
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, fontWeight: 600 }}>
                Basic Information
            </Typography>

            <TextField
                fullWidth
                label="Customer Name"
                value={formData.name}
                onChange={handleChange('name')}
                required
                size="small"
                sx={{ mb: 2 }}
            />

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange('email')}
                    required
                    size="small"
                />
                <TextField
                    fullWidth
                    label="Phone"
                    value={formData.phone}
                    onChange={handleChange('phone')}
                    required
                    size="small"
                    placeholder="+2348012345678"
                />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                    fullWidth
                    label="Contact Person"
                    value={formData.contact_person}
                    onChange={handleChange('contact_person')}
                    size="small"
                />
                <TextField
                    fullWidth
                    select
                    label="Classification"
                    value={formData.classification_id}
                    onChange={handleChange('classification_id')}
                    size="small"
                >
                    <MenuItem value="1">Type 1</MenuItem>
                    <MenuItem value="2">Type 2</MenuItem>
                    <MenuItem value="3">Type 3</MenuItem>
                </TextField>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Address Section */}
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, fontWeight: 600 }}>
                Address
            </Typography>

            <TextField
                fullWidth
                label="Address"
                value={formData.address}
                onChange={handleChange('address')}
                size="small"
                sx={{ mb: 2 }}
            />

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                    fullWidth
                    label="City"
                    value={formData.city}
                    onChange={handleChange('city')}
                    size="small"
                />
                <TextField
                    fullWidth
                    label="State"
                    value={formData.state}
                    onChange={handleChange('state')}
                    size="small"
                />
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Financial Section */}
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, fontWeight: 600 }}>
                Financial
            </Typography>

            <TextField
                fullWidth
                label="Credit Limit"
                type="number"
                value={formData.credit_limit}
                onChange={handleChange('credit_limit')}
                size="small"
                sx={{ mb: 3 }}
            />

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleSubmit}
                    sx={{ py: 1.2 }}
                >
                    {isEdit ? 'Update Customer' : 'Create Customer'}
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

    // Modal mode: return just the content with a header
    if (isModal) {
        return (
            <>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>{isEdit ? 'Edit Customer' : 'New Customer'}</IonTitle>
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

    // Page mode: wrap in IonPage
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/customers" />
                    </IonButtons>
                    <IonTitle>{isEdit ? 'Edit Customer' : 'New Customer'}</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
                {formContent}
            </IonContent>
        </IonPage>
    );
};

export default CustomerForm;
