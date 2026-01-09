import React, { useEffect, useState } from 'react';
import {
    IonList,
    IonItem,
    IonLabel,
    IonLoading,
    IonToast,
    IonBadge
} from '@ionic/react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import { requestID, baseUrl, config } from '../../common/utils';

interface LedgerEntry {
    id: string;
    date: string;
    type: string;
    reference: string;
    description: string;
    debit: number;
    credit: number;
    balance: number;
}

const CustomerLedger: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    const [entries, setEntries] = useState<LedgerEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        if (id) {
            fetchLedger();
        }
    }, [id]);

    const fetchLedger = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("requestID", requestID());
            formData.append("customer_id", id);

            const response = await axios.post(
                baseUrl() + "geacloud_ledger/getCustomerLedger_caas",
                formData,
                config
            );

            console.log({ response });
            const { data } = response.data;

            if (data && Array.isArray(data)) {
                setEntries(data);
            } else {
                setEntries([]);
            }

            setLoading(false);
        } catch (error) {
            console.error("Error fetching ledger:", error);
            setToastMessage("Failed to load ledger");
            setShowToast(true);
            setLoading(false);
        }
    };

    const getTypeColor = (type: string) => {
        switch (type?.toLowerCase()) {
            case 'invoice': return 'danger';
            case 'payment': return 'success';
            case 'credit note': return 'warning';
            default: return 'medium';
        }
    };

    return (
        <>
            <IonLoading isOpen={loading} message="Loading ledger..." spinner="circles" />

            <IonToast
                isOpen={showToast}
                onDidDismiss={() => setShowToast(false)}
                message={toastMessage}
                duration={3000}
            />

            <IonList>
                <IonItem color="light">
                    <IonLabel>
                        <strong>Date / Type</strong>
                    </IonLabel>
                    <IonLabel slot="end" className="ion-text-right">
                        <strong>Debit / Credit / Balance</strong>
                    </IonLabel>
                </IonItem>

                {entries.length === 0 && !loading ? (
                    <IonItem>
                        <IonLabel className="ion-text-center">
                            <p>No ledger entries found</p>
                        </IonLabel>
                    </IonItem>
                ) : (
                    entries.map((entry) => (
                        <IonItem key={entry.id}>
                            <IonLabel>
                                <h3>{new Date(entry.date).toLocaleDateString()}</h3>
                                <p>
                                    <IonBadge color={getTypeColor(entry.type)}>
                                        {entry.type}
                                    </IonBadge>
                                    {' '}{entry.reference}
                                </p>
                                <p>{entry.description}</p>
                            </IonLabel>
                            <IonLabel slot="end" className="ion-text-right">
                                <p style={{ color: '#eb445a' }}>
                                    Dr: ${entry.debit?.toLocaleString() || '0.00'}
                                </p>
                                <p style={{ color: '#2dd36f' }}>
                                    Cr: ${entry.credit?.toLocaleString() || '0.00'}
                                </p>
                                <h3>Bal: ${entry.balance?.toLocaleString()}</h3>
                            </IonLabel>
                        </IonItem>
                    ))
                )}
            </IonList>
        </>
    );
};

export default CustomerLedger;
