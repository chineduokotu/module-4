import React, { useEffect, useState } from 'react';
import {
    IonList,
    IonItem,
    IonLabel,
    IonBadge,
    IonLoading,
    IonToast,
    IonButton,
    IonIcon
} from '@ionic/react';
import { add } from 'ionicons/icons';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import { requestID, baseUrl, config } from '../../common/utils';

interface Receipt {
    id: string;
    number: string;
    date: string;
    amount: number;
    paymentMethod: string;
    reference: string;
    status: string;
}

const CustomerReceipts: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    const [receipts, setReceipts] = useState<Receipt[]>([]);
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        if (id) {
            fetchReceipts();
        }
    }, [id]);

    const fetchReceipts = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("requestID", requestID());
            formData.append("customer_id", id);

            const response = await axios.post(
                baseUrl() + "geacloud_receipts/getReceiptsByCustomer_caas",
                formData,
                config
            );

            console.log({ response });
            const { data } = response.data;

            if (data && Array.isArray(data)) {
                setReceipts(data);
            } else {
                setReceipts([]);
            }

            setLoading(false);
        } catch (error) {
            console.error("Error fetching receipts:", error);
            setToastMessage("Failed to load receipts");
            setShowToast(true);
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'completed': return 'success';
            case 'pending': return 'warning';
            case 'failed': return 'danger';
            default: return 'medium';
        }
    };

    return (
        <>
            <IonLoading isOpen={loading} message="Loading receipts..." spinner="circles" />

            <IonToast
                isOpen={showToast}
                onDidDismiss={() => setShowToast(false)}
                message={toastMessage}
                duration={3000}
            />

            <div style={{ padding: '16px' }}>
                <IonButton expand="block" onClick={() => alert('New Receipt - Coming Soon')}>
                    <IonIcon icon={add} slot="start" />
                    New Receipt
                </IonButton>
            </div>

            <IonList>
                {receipts.length === 0 && !loading ? (
                    <IonItem>
                        <IonLabel className="ion-text-center">
                            <p>No receipts found</p>
                        </IonLabel>
                    </IonItem>
                ) : (
                    receipts.map((receipt) => (
                        <IonItem key={receipt.id}>
                            <IonLabel>
                                <h2>Receipt #{receipt.number}</h2>
                                <p>Date: {new Date(receipt.date).toLocaleDateString()}</p>
                                <p>Method: {receipt.paymentMethod}</p>
                                <p>Ref: {receipt.reference}</p>
                            </IonLabel>
                            <IonLabel slot="end" className="ion-text-right">
                                <h3 style={{ color: '#2dd36f' }}>
                                    ${receipt.amount?.toLocaleString()}
                                </h3>
                            </IonLabel>
                            <IonBadge slot="end" color={getStatusColor(receipt.status)}>
                                {receipt.status}
                            </IonBadge>
                        </IonItem>
                    ))
                )}
            </IonList>
        </>
    );
};

export default CustomerReceipts;
