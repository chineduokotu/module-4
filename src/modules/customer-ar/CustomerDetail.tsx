import React, { useEffect, useState } from 'react';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonLoading,
    IonToast,
    IonGrid,
    IonRow,
    IonCol,
    IonBadge,
    IonModal
} from '@ionic/react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';

import { requestID, baseUrl, config } from '../../common/utils';
import CustomerInvoices from './CustomerInvoices';
import CustomerReceipts from './CustomerReceipts';
import CustomerLedger from './CustomerLedger';
import CustomerForm from './CustomerForm';

// Customer interface
interface Customer {
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

interface CustomerSummary {
    totalInvoices: number;
    totalOutstanding: number;
    totalPaid: number;
    overdueAmount: number;
}

// Boss's Pattern: Location state interface
interface LocationState {
    customer?: Customer;
}

const CustomerDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const history = useHistory();
    const location = useLocation<LocationState>(); // Boss's Pattern: useLocation with Generics

    const [customer, setCustomer] = useState<Customer | null>(null);
    const [summary, setSummary] = useState<CustomerSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [activeTab, setActiveTab] = useState('overview');
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        if (location.pathname.includes('/invoices')) setActiveTab('invoices');
        else if (location.pathname.includes('/receipts')) setActiveTab('receipts');
        else if (location.pathname.includes('/ledger')) setActiveTab('ledger');
        else setActiveTab('overview');
    }, [location.pathname]);

    useEffect(() => {
        if (id) {
            // Boss's Pattern: Check state transfer first, then fallback to API
            const customerFromState = location.state?.customer;
            
            if (customerFromState) {
                // State Transfer: Use data directly, skip API call
                console.log('CustomerDetail: Using state transfer - skipping API call');
                setCustomer(customerFromState);
                setSummary({
                    totalInvoices: 0,
                    totalOutstanding: parseFloat(customerFromState.current_balance) || 0,
                    totalPaid: 0,
                    overdueAmount: 0
                });
                setLoading(false);
            } else {
                // Fallback: API call (e.g., user refreshed the page)
                console.log('CustomerDetail: No state transfer - fetching from API');
                fetchCustomer();
            }
        }
    }, [id]);

    // Boss's Pattern: axios.post with FormData for API fallback
    const fetchCustomer = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("requestID", requestID());
            formData.append("customer_id", id);

            const response = await axios.post(
                baseUrl() + "Geacloud_Customers/getCustomer_caas",
                formData,
                config
            );

            console.log({ response });
            const { data } = response.data;

            if (data) {
                setCustomer(data);
                setSummary({
                    totalInvoices: 0,
                    totalOutstanding: parseFloat(data.current_balance) || 0,
                    totalPaid: 0,
                    overdueAmount: 0
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

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        if (tab === 'overview') {
            history.push(`/customers/${id}`);
        } else {
            history.push(`/customers/${id}/${tab}`);
        }
    };

    // Handle edit modal success - refresh customer data
    const handleEditSuccess = () => {
        setShowEditModal(false);
        fetchCustomer(); // Refresh to get updated data
    };

    if (loading) {
        return (
            <IonPage>
                <IonLoading isOpen={true} message="Loading..." spinner="circles" />
            </IonPage>
        );
    }

    if (!customer) {
        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonBackButton defaultHref="/customers" />
                        </IonButtons>
                        <IonTitle>Customer Not Found</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                    <p>Customer not found.</p>
                </IonContent>
            </IonPage>
        );
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/customers" />
                    </IonButtons>
                    <IonTitle>{customer.name}</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={() => setShowEditModal(true)}>
                            Edit
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
                <IonToolbar>
                    <IonSegment value={activeTab} onIonChange={(e) => handleTabChange(e.detail.value as string)}>
                        <IonSegmentButton value="overview">
                            <IonLabel>Overview</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="invoices">
                            <IonLabel>Invoices</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="receipts">
                            <IonLabel>Receipts</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="ledger">
                            <IonLabel>Ledger</IonLabel>
                        </IonSegmentButton>
                    </IonSegment>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
                <IonToast
                    isOpen={showToast}
                    onDidDismiss={() => setShowToast(false)}
                    message={toastMessage}
                    duration={3000}
                />

                {activeTab === 'overview' && (
                    <>
                        <IonCard>
                            <IonCardHeader>
                                <IonCardTitle>
                                    {customer.name}
                                    <IonBadge 
                                        color={customer.status === 1 ? 'success' : 'medium'}
                                        style={{ marginLeft: '10px' }}
                                    >
                                        {customer.status === 1 ? 'Active' : 'Inactive'}
                                    </IonBadge>
                                </IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                <p><strong>Code:</strong> {customer.customer_code}</p>
                                <p><strong>Email:</strong> {customer.email}</p>
                                <p><strong>Phone:</strong> {customer.phone}</p>
                                <p><strong>Address:</strong> {customer.address}, {customer.city}, {customer.state}</p>
                                <p><strong>Contact Person:</strong> {customer.contact_person}</p>
                            </IonCardContent>
                        </IonCard>

                        <IonGrid>
                            <IonRow>
                                <IonCol size="6">
                                    <IonCard>
                                        <IonCardContent className="ion-text-center">
                                            <h2 style={{ margin: 0, color: '#3880ff' }}>
                                                {summary?.totalInvoices || 0}
                                            </h2>
                                            <p>Total Invoices</p>
                                        </IonCardContent>
                                    </IonCard>
                                </IonCol>
                                <IonCol size="6">
                                    <IonCard>
                                        <IonCardContent className="ion-text-center">
                                            <h2 style={{ margin: 0, color: '#eb445a' }}>
                                                ${summary?.totalOutstanding?.toLocaleString() || 0}
                                            </h2>
                                            <p>Outstanding</p>
                                        </IonCardContent>
                                    </IonCard>
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol size="6">
                                    <IonCard>
                                        <IonCardContent className="ion-text-center">
                                            <h2 style={{ margin: 0, color: '#2dd36f' }}>
                                                ${summary?.totalPaid?.toLocaleString() || 0}
                                            </h2>
                                            <p>Total Paid</p>
                                        </IonCardContent>
                                    </IonCard>
                                </IonCol>
                                <IonCol size="6">
                                    <IonCard>
                                        <IonCardContent className="ion-text-center">
                                            <h2 style={{ margin: 0, color: '#ffc409' }}>
                                                ${summary?.overdueAmount?.toLocaleString() || 0}
                                            </h2>
                                            <p>Overdue</p>
                                        </IonCardContent>
                                    </IonCard>
                                </IonCol>
                            </IonRow>
                        </IonGrid>

                        <div style={{ padding: '16px' }}>
                            <IonButton expand="block" onClick={() => history.push(`/customers/${id}/statement`)}>
                                View Statement
                            </IonButton>
                        </div>
                    </>
                )}

                {activeTab === 'invoices' && <CustomerInvoices />}
                {activeTab === 'receipts' && <CustomerReceipts />}
                {activeTab === 'ledger' && <CustomerLedger />}

                {/* Customer Edit Modal - STATE TRANSFER: pass customer object */}
                <IonModal 
                    isOpen={showEditModal} 
                    onDidDismiss={() => setShowEditModal(false)}
                >
                    <CustomerForm
                        isModal={true}
                        customerId={id}
                        customerData={customer}
                        onSuccess={handleEditSuccess}
                        onCancel={() => setShowEditModal(false)}
                    />
                </IonModal>
            </IonContent>
        </IonPage>
    );
};

export default CustomerDetail;
