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
    IonButton,
    IonIcon,
    IonLoading,
    IonToast,
    IonSearchbar,
    IonRefresher,
    IonRefresherContent,
    IonButtons,
    IonBadge,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonModal
} from '@ionic/react';
import { add, eye, trash, create } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import { requestID, baseUrl, config } from '../../common/utils';
import CustomerForm from './CustomerForm';

// Customer interface - shared type
export interface Customer {
    id: number;
    customer_code: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    contact_person: string;
    status: number;
    credit_limit: string;
    current_balance: string;
    classification_id?: string;
}

const CustomerList: React.FC = () => {
    const history = useHistory();
    
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    // Modal state
    const [showFormModal, setShowFormModal] = useState(false);
    const [editCustomerId, setEditCustomerId] = useState<string | null>(null);
    // State Transfer: Pass customer object directly to avoid extra API call
    const [editCustomerData, setEditCustomerData] = useState<Customer | null>(null);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("requestID", requestID());

            const response = await axios.post(
                baseUrl() + "Geacloud_Customers",
                formData,
                config
            );

            console.log({ response });
            const { data } = response.data;
            
            if (data && Array.isArray(data)) {
                setCustomers(data);
                setFilteredCustomers(data);
            } else {
                setCustomers([]);
                setFilteredCustomers([]);
            }

            setLoading(false);
        } catch (error) {
            console.error("Error fetching customers:", error);
            setToastMessage("Failed to load customers");
            setShowToast(true);
            setLoading(false);
        }
    };

    const handleDelete = async (customerId: number) => {
        if (!window.confirm('Are you sure you want to delete this customer?')) {
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("requestID", requestID());
            formData.append("customer_id", customerId.toString());

            await axios.post(
                baseUrl() + "Geacloud_Customers/deleteCustomer_caas",
                formData,
                config
            );

            setToastMessage("Customer deleted successfully");
            setShowToast(true);
            fetchCustomers();
        } catch (error) {
            console.error("Error deleting customer:", error);
            setToastMessage("Failed to delete customer");
            setShowToast(true);
            setLoading(false);
        }
    };

    // Open modal for new customer
    const handleNewCustomer = () => {
        setEditCustomerId(null);
        setEditCustomerData(null); // No customer data for new
        setShowFormModal(true);
    };

    // Open modal for editing customer - STATE TRANSFER: pass customer object
    const handleEditCustomer = (customer: Customer) => {
        setEditCustomerId(customer.id.toString());
        setEditCustomerData(customer); // Pass customer data to avoid API call
        setShowFormModal(true);
    };

    // Navigate to customer detail - STATE TRANSFER: pass customer object
    const handleViewCustomer = (customer: Customer) => {
        history.push(`/customers/${customer.id}`, { customer });
    };

    // Handle form success (close modal and refresh)
    const handleFormSuccess = () => {
        setShowFormModal(false);
        setEditCustomerId(null);
        setEditCustomerData(null);
        fetchCustomers();
    };

    // Handle form cancel
    const handleFormCancel = () => {
        setShowFormModal(false);
        setEditCustomerId(null);
        setEditCustomerData(null);
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    useEffect(() => {
        if (searchText === '') {
            setFilteredCustomers(customers);
        } else {
            const filtered = customers.filter(customer =>
                customer.name.toLowerCase().includes(searchText.toLowerCase()) ||
                customer.customer_code.toLowerCase().includes(searchText.toLowerCase()) ||
                customer.email?.toLowerCase().includes(searchText.toLowerCase())
            );
            setFilteredCustomers(filtered);
        }
    }, [searchText, customers]);

    const handleRefresh = async (event: CustomEvent) => {
        await fetchCustomers();
        event.detail.complete();
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Customers</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={handleNewCustomer}>
                            <IonIcon icon={add} slot="start" />
                            New
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
                <IonToolbar>
                    <IonSearchbar
                        value={searchText}
                        onIonChange={(e) => setSearchText(e.detail.value || '')}
                        placeholder="Search customers..."
                        debounce={300}
                    />
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
                <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                    <IonRefresherContent />
                </IonRefresher>

                <IonLoading isOpen={loading} message="Loading..." spinner="circles" />

                <IonToast
                    isOpen={showToast}
                    onDidDismiss={() => setShowToast(false)}
                    message={toastMessage}
                    duration={3000}
                    position="bottom"
                />

                <IonList>
                    {filteredCustomers.length === 0 && !loading ? (
                        <IonItem>
                            <IonLabel className="ion-text-center">
                                <p>No customers found</p>
                            </IonLabel>
                        </IonItem>
                    ) : (
                        filteredCustomers.map((customer) => (
                            <IonItemSliding key={customer.id}>
                                <IonItem 
                                    button 
                                    onClick={() => handleViewCustomer(customer)}
                                    detail={true}
                                >
                                    <IonLabel>
                                        <h2>{customer.name}</h2>
                                        <p>Code: {customer.customer_code}</p>
                                        <p>{customer.email} | {customer.phone}</p>
                                    </IonLabel>
                                    <IonBadge 
                                        slot="end" 
                                        color={customer.status === 1 ? 'success' : 'medium'}
                                    >
                                        {customer.status === 1 ? 'Active' : 'Inactive'}
                                    </IonBadge>
                                    <IonLabel slot="end" className="ion-text-right">
                                        <p style={{ fontWeight: 'bold' }}>
                                            Balance: ${Number(customer.current_balance || 0).toLocaleString()}
                                        </p>
                                    </IonLabel>
                                </IonItem>

                                <IonItemOptions side="end">
                                    <IonItemOption 
                                        color="primary"
                                        onClick={() => handleViewCustomer(customer)}
                                    >
                                        <IonIcon icon={eye} slot="icon-only" />
                                    </IonItemOption>
                                    <IonItemOption 
                                        color="secondary"
                                        onClick={() => handleEditCustomer(customer)}
                                    >
                                        <IonIcon icon={create} slot="icon-only" />
                                    </IonItemOption>
                                    <IonItemOption 
                                        color="danger"
                                        onClick={() => handleDelete(customer.id)}
                                    >
                                        <IonIcon icon={trash} slot="icon-only" />
                                    </IonItemOption>
                                </IonItemOptions>
                            </IonItemSliding>
                        ))
                    )}
                </IonList>

                {filteredCustomers.length > 0 && (
                    <div style={{ padding: '16px', textAlign: 'center', color: '#666' }}>
                        Showing {filteredCustomers.length} of {customers.length} customers
                    </div>
                )}

                {/* Customer Form Modal - STATE TRANSFER: pass customerData */}
                <IonModal 
                    isOpen={showFormModal} 
                    onDidDismiss={handleFormCancel}
                >
                    <CustomerForm
                        isModal={true}
                        customerId={editCustomerId}
                        customerData={editCustomerData}
                        onSuccess={handleFormSuccess}
                        onCancel={handleFormCancel}
                    />
                </IonModal>
            </IonContent>
        </IonPage>
    );
};

export default CustomerList;
