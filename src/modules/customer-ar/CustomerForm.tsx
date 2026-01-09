import React, { useState, useEffect } from 'react';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonButtons,
    IonBackButton,
    IonLoading,
    IonToast,
    IonSelect,
    IonSelectOption
} from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';

import { requestID, baseUrl, config } from '../../common/utils';

const CustomerForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const history = useHistory();
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
            fetchCustomer();
        }
    }, [isEdit, id]);

    const fetchCustomer = async () => {
        setLoading(true);
        try {
            const formDataReq = new FormData();
            formDataReq.append("requestID", requestID());
            formDataReq.append("customer_id", id);

            const response = await axios.post(
                baseUrl() + "Geacloud_Customers/getCustomer_caas",
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

    const handleChange = (field: string, value: string | number | null | undefined) => {
        setFormData(prev => ({ ...prev, [field]: value || '' }));
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
                    baseUrl() + "Geacloud_Customers/updateCustomer_caas",
                    submitData,
                    config
                );
                setToastMessage("Customer updated successfully");
            } else {
                await axios.post(
                    baseUrl() + "Geacloud_Customers/createCustomer_caas",
                    submitData,
                    config
                );
                setToastMessage("Customer created successfully");
            }

            setShowToast(true);
            setLoading(false);
            
            setTimeout(() => {
                history.push('/customers');
            }, 1000);

        } catch (error) {
            console.error("Error saving customer:", error);
            setToastMessage("Failed to save customer");
            setShowToast(true);
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
                    <IonButtons slot="end">
                        <IonButton onClick={handleSubmit} strong>
                            Save
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
                <IonLoading isOpen={loading} message="Please wait..." spinner="circles" />

                <IonToast
                    isOpen={showToast}
                    onDidDismiss={() => setShowToast(false)}
                    message={toastMessage}
                    duration={3000}
                    position="bottom"
                />

                <IonList>
                    <IonItem>
                        <IonLabel position="stacked">Customer Name *</IonLabel>
                        <IonInput
                            value={formData.name}
                            onIonChange={(e) => handleChange('name', e.detail.value)}
                            placeholder="Enter customer name"
                        />
                    </IonItem>

                    <IonItem>
                        <IonLabel position="stacked">Email *</IonLabel>
                        <IonInput
                            type="email"
                            value={formData.email}
                            onIonChange={(e) => handleChange('email', e.detail.value)}
                            placeholder="Enter email address"
                        />
                    </IonItem>

                    <IonItem>
                        <IonLabel position="stacked">Phone *</IonLabel>
                        <IonInput
                            type="tel"
                            value={formData.phone}
                            onIonChange={(e) => handleChange('phone', e.detail.value)}
                            placeholder="+2348012345678"
                        />
                    </IonItem>

                    <IonItem>
                        <IonLabel position="stacked">Classification</IonLabel>
                        <IonSelect
                            value={formData.classification_id}
                            onIonChange={(e) => handleChange('classification_id', e.detail.value)}
                        >
                            <IonSelectOption value="1">Type 1</IonSelectOption>
                            <IonSelectOption value="2">Type 2</IonSelectOption>
                            <IonSelectOption value="3">Type 3</IonSelectOption>
                        </IonSelect>
                    </IonItem>

                    <IonItem>
                        <IonLabel position="stacked">Address</IonLabel>
                        <IonInput
                            value={formData.address}
                            onIonChange={(e) => handleChange('address', e.detail.value)}
                            placeholder="Enter address"
                        />
                    </IonItem>

                    <IonItem>
                        <IonLabel position="stacked">City</IonLabel>
                        <IonInput
                            value={formData.city}
                            onIonChange={(e) => handleChange('city', e.detail.value)}
                            placeholder="Enter city"
                        />
                    </IonItem>

                    <IonItem>
                        <IonLabel position="stacked">State</IonLabel>
                        <IonInput
                            value={formData.state}
                            onIonChange={(e) => handleChange('state', e.detail.value)}
                            placeholder="Enter state"
                        />
                    </IonItem>

                    <IonItem>
                        <IonLabel position="stacked">Contact Person</IonLabel>
                        <IonInput
                            value={formData.contact_person}
                            onIonChange={(e) => handleChange('contact_person', e.detail.value)}
                            placeholder="Enter contact person name"
                        />
                    </IonItem>

                    <IonItem>
                        <IonLabel position="stacked">Credit Limit</IonLabel>
                        <IonInput
                            type="number"
                            value={formData.credit_limit}
                            onIonChange={(e) => handleChange('credit_limit', e.detail.value)}
                            placeholder="0"
                        />
                    </IonItem>
                </IonList>

                <div style={{ padding: '16px' }}>
                    <IonButton expand="block" onClick={handleSubmit}>
                        {isEdit ? 'Update Customer' : 'Create Customer'}
                    </IonButton>
                    <IonButton expand="block" fill="outline" onClick={() => history.goBack()}>
                        Cancel
                    </IonButton>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default CustomerForm;
