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
    IonSegment,
    IonSegmentButton,
    IonModal
} from '@ionic/react';
import { add } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import { requestID, baseUrl, config } from '../../common/utils';
import InvoiceForm from './InvoiceForm';

interface Invoice {
    id: string;
    number: string;
    customer_id: number;
    customer_name: string;
    date: string;
    dueDate: string;
    totalAmount: number;
    balance: number;
    status: string;
}

const InvoiceList: React.FC = () => {
    const history = useHistory();
    
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    // Modal state
    const [showFormModal, setShowFormModal] = useState(false);

    const fetchInvoices = async (status?: string) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("requestID", requestID());
            
            if (status && status !== 'all') {
                formData.append("status", status);
            }

            const response = await axios.post(
                baseUrl() + "geacloud_invoices",
                formData,
                config
            );

            console.log({ response });
            const { data } = response.data;
            
            if (data && Array.isArray(data)) {
                setInvoices(data);
                setFilteredInvoices(data);
            } else {
                setInvoices([]);
                setFilteredInvoices([]);
            }

            setLoading(false);
        } catch (error) {
            console.error("Error fetching invoices:", error);
            setToastMessage("Failed to load invoices");
            setShowToast(true);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoices(statusFilter);
    }, [statusFilter]);

    useEffect(() => {
        if (searchText === '') {
            setFilteredInvoices(invoices);
        } else {
            const filtered = invoices.filter(invoice =>
                invoice.number.toLowerCase().includes(searchText.toLowerCase()) ||
                invoice.customer_name?.toLowerCase().includes(searchText.toLowerCase())
            );
            setFilteredInvoices(filtered);
        }
    }, [searchText, invoices]);

    const handleRefresh = async (event: CustomEvent) => {
        await fetchInvoices(statusFilter);
        event.detail.complete();
    };

    const handleNewInvoice = () => {
        setShowFormModal(true);
    };

    const handleViewInvoice = (invoice: Invoice) => {
        history.push(`folder/invoices/${invoice.id}`);
    };

    const handleFormSuccess = () => {
        setShowFormModal(false);
        fetchInvoices(statusFilter);
    };

    const handleFormCancel = () => {
        setShowFormModal(false);
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'paid': return 'success';
            case 'overdue': return 'danger';
            case 'sent': return 'primary';
            case 'draft': return 'medium';
            default: return 'medium';
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Invoices</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={handleNewInvoice}>
                            <IonIcon icon={add} slot="start" />
                            New
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
                <IonToolbar>
                    <IonSearchbar
                        value={searchText}
                        onIonChange={(e) => setSearchText(e.detail.value || '')}
                        placeholder="Search invoices..."
                        debounce={300}
                    />
                </IonToolbar>
                <IonToolbar>
                    <IonSegment value={statusFilter} onIonChange={(e) => setStatusFilter(e.detail.value as string)}>
                        <IonSegmentButton value="all">
                            <IonLabel>All</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="unpaid">
                            <IonLabel>Unpaid</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="paid">
                            <IonLabel>Paid</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="overdue">
                            <IonLabel>Overdue</IonLabel>
                        </IonSegmentButton>
                    </IonSegment>
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
                    {filteredInvoices.length === 0 && !loading ? (
                        <IonItem>
                            <IonLabel className="ion-text-center">
                                <p>No invoices found</p>
                            </IonLabel>
                        </IonItem>
                    ) : (
                        filteredInvoices.map((invoice) => (
                            <IonItem 
                                key={invoice.id} 
                                button 
                                onClick={() => handleViewInvoice(invoice)}
                                detail={true}
                            >
                                <IonLabel>
                                    <h2>Invoice #{invoice.number}</h2>
                                    <p>Customer: {invoice.customer_name}</p>
                                    <p>Date: {new Date(invoice.date).toLocaleDateString()}</p>
                                    <p>Due: {new Date(invoice.dueDate).toLocaleDateString()}</p>
                                </IonLabel>
                                <IonLabel slot="end" className="ion-text-right">
                                    <h3>${invoice.totalAmount?.toLocaleString()}</h3>
                                    <p>Balance: ${invoice.balance?.toLocaleString()}</p>
                                </IonLabel>
                                <IonBadge slot="end" color={getStatusColor(invoice.status)}>
                                    {invoice.status}
                                </IonBadge>
                            </IonItem>
                        ))
                    )}
                </IonList>

                {filteredInvoices.length > 0 && (
                    <div style={{ padding: '16px', textAlign: 'center', color: '#666' }}>
                        Showing {filteredInvoices.length} of {invoices.length} invoices
                    </div>
                )}

                {/* Invoice Form Modal */}
                <IonModal 
                    isOpen={showFormModal} 
                    onDidDismiss={handleFormCancel}
                >
                    <InvoiceForm
                        isModal={true}
                        onSuccess={handleFormSuccess}
                        onCancel={handleFormCancel}
                    />
                </IonModal>
            </IonContent>
        </IonPage>
    );
};

export default InvoiceList;
