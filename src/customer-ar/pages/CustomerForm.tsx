import React, { useState, useEffect } from 'react';
//import { useNavigate } from 'react-router-dom';

import {
    Box, Typography, Button, TextField, Stack, Paper, MenuItem, Grid
} from '@mui/material';
import { useParams, useHistory } from 'react-router-dom';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../types/customer';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton } from '@ionic/react';

const CustomerForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const history = useHistory();
    const isEdit = Boolean(id);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState<Partial<Customer>>({
        name: '',
        code: '',
        customerType: 'Business',
        status: 'Active',
        paymentTerms: 'Net 30',
        creditLimit: 0,
        currency: 'USD',
        email: '',
        phone: ''
    });



    // const navigate=useNavigate();

    useEffect(() => {
        if (isEdit && id) {
            setLoading(true);
            CustomerService.getCustomer(id)
                .then(data => {
                    if (data) setFormData(data);
                })
                .finally(() => setLoading(false));
        }
    }, [isEdit, id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEdit && id) {
                await CustomerService.updateCustomer(id, formData);
            } else {
                await CustomerService.createCustomer(formData as any);
            }
            history.push('/customers');
        } catch (error) {
            console.error("Error saving customer", error);
        } finally {
            setLoading(false);
        }
    };

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
            <IonContent>
                <Box sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
                    <Paper sx={{ p: 3 }}>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="Customer Name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="Customer Code"
                                        name="code"
                                        value={formData.code}
                                        onChange={handleChange}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        select
                                        fullWidth
                                        label="Customer Type"
                                        name="customerType"
                                        value={formData.customerType ?? 'Business'}
                                        onChange={handleChange}
                                    >
                                        <MenuItem value="Business">Business</MenuItem>
                                        <MenuItem value="Individual">Individual</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Credit Limit"
                                        name="creditLimit"
                                        type="number"
                                        value={formData.creditLimit}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        select
                                        fullWidth
                                        label="Payment Terms"
                                        name="paymentTerms"
                                        value={formData.paymentTerms}
                                        onChange={handleChange}
                                    >
                                        <MenuItem value="Immediate">Immediate</MenuItem>
                                        <MenuItem value="Net 15">Net 15</MenuItem>
                                        <MenuItem value="Net 30">Net 30</MenuItem>
                                        <MenuItem value="Net 60">Net 60</MenuItem>
                                    </TextField>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        select
                                        fullWidth
                                        label="Status"
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                    >
                                        <MenuItem value="Active">Active</MenuItem>
                                        <MenuItem value="Inactive">Inactive</MenuItem>
                                        <MenuItem value="Blocked">Blocked</MenuItem>
                                    </TextField>
                                </Grid>

                                <Grid item xs={12}>
                                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                                        <Button onClick={() => history.push('/customers')}>Cancel</Button>
                                        <Button type="submit" variant="contained" disabled={loading}>
                                            {loading ? 'Saving...' : 'Save Customer'}
                                        </Button>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </form>
                    </Paper>
                </Box>
            </IonContent>
        </IonPage>
    );
};

export default CustomerForm;
