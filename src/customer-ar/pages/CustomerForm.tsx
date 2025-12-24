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

    const [formData, setFormData] = useState<any>({
        requestID: `rid_${Date.now()}`,
        name: '',
        email: '',
        phone: '',
        classification_id: 1,
        address: '',
        city: '',
        state: '',
        contact_person: '',
        credit_limit: 0
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
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEdit && id) {
                await CustomerService.updateCustomer(id, formData);
            } else {
                // Generate a fresh requestID for each submission
                const submitData = {
                    ...formData,
                    requestID: `rid_${Date.now()}`
                };
                await CustomerService.createCustomer(submitData);
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
                                        label="Email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="Phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+2348012345678"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        select
                                        required
                                        fullWidth
                                        label="Classification"
                                        name="classification_id"
                                        value={formData.classification_id}
                                        onChange={handleChange}
                                    >
                                        <MenuItem value={1}>Type 1</MenuItem>
                                        <MenuItem value={2}>Type 2</MenuItem>
                                        <MenuItem value={3}>Type 3</MenuItem>
                                    </TextField>
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="Address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="123 Medical Street, Victoria Island"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="City"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="State"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="Contact Person"
                                        name="contact_person"
                                        value={formData.contact_person}
                                        onChange={handleChange}
                                        placeholder="Dr. Smith Johnson"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="Credit Limit"
                                        name="credit_limit"
                                        type="number"
                                        value={formData.credit_limit}
                                        onChange={handleChange}
                                    />
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
