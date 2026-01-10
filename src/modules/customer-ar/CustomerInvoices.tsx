import React, { useEffect, useState } from 'react';
import {
    IonList,
    IonItem,
    IonLabel,
    IonBadge,
    IonLoading,
    IonToast
} from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';

import { requestID, baseUrl, config } from '../../common/utils';

interface Invoice {
    id: string;
    number: string;
    date: string;
    dueDate: string;
    totalAmount: number;
    balance: number;
    status: string;
}

const CustomerInvoices: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const history = useHistory();

    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        if (id) {
            fetchInvoices();
        }
    }, [id]);

    const fetchInvoices = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("requestID", requestID());
            formData.append("customer_id", id);

            const response = await axios.post(
                baseUrl() + "geacloud_invoices",
                formData,
                config
            );

            console.log({ response });
            const { data } = response.data;

            if (data && Array.isArray(data)) {
                setInvoices(data);
            } else {
                setInvoices([]);
            }

            setLoading(false);
        } catch (error) {
            console.error("Error fetching invoices:", error);
            setToastMessage("Failed to load invoices");
            setShowToast(true);
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'paid': return 'success';
            case 'overdue': return 'danger';
            case 'sent': return 'primary';
            default: return 'medium';
        }
    };

    return (
        <>
            <IonLoading isOpen={loading} message="Loading invoices..." spinner="circles" />

            <IonToast
                isOpen={showToast}
                onDidDismiss={() => setShowToast(false)}
                message={toastMessage}
                duration={3000}
            />

            <IonList>
                {invoices.length === 0 && !loading ? (
                    <IonItem>
                        <IonLabel className="ion-text-center">
                            <p>No invoices found</p>
                        </IonLabel>
                    </IonItem>
                ) : (
                    invoices.map((invoice) => (
                        <IonItem 
                            key={invoice.id} 
                            button 
                            onClick={() => history.push(`folder/invoices/${invoice.id}`)}
                            detail
                        >
                            <IonLabel>
                                <h2>Invoice #{invoice.number}</h2>
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
        </>
    );
};

export default CustomerInvoices;
