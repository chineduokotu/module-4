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
    IonLoading,
    IonToast,
    IonList,
    IonItem,
    IonLabel,
    IonIcon
} from '@ionic/react';
import { print } from 'ionicons/icons';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import { requestID, baseUrl, config } from '../../common/utils';

interface Customer {
    id: number;
    customer_code: string;
    name: string;
    current_balance: string;
}

interface StatementItem {
    id: string;
    date: string;
    activity: string;
    reference: string;
    amount: number;
    balance: number;
}

const CustomerStatement: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    const [customer, setCustomer] = useState<Customer | null>(null);
    const [items, setItems] = useState<StatementItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        if (id) {
            fetchData();
        }
    }, [id]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch Customer
            const customerForm = new FormData();
            customerForm.append("requestID", requestID());
            customerForm.append("customer_id", id);

            const customerResponse = await axios.post(
                baseUrl() + "Geacloud_Customers/getCustomer_caas",
                customerForm,
                config
            );
            
            const { data: customerData } = customerResponse.data;
            setCustomer(customerData);

            // Fetch Statement
            const stmtForm = new FormData();
            stmtForm.append("requestID", requestID());
            stmtForm.append("customer_id", id);

            const stmtResponse = await axios.post(
                baseUrl() + "geacloud_reports/getCustomerStatement_caas",
                stmtForm,
                config
            );

            console.log({ stmtResponse });
            const { data: stmtData } = stmtResponse.data;

            if (stmtData && Array.isArray(stmtData)) {
                setItems(stmtData);
            } else {
                setItems([]);
            }

            setLoading(false);
        } catch (error) {
            console.error("Error fetching statement:", error);
            setToastMessage("Failed to load statement");
            setShowToast(true);
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <IonPage>
                <IonLoading isOpen={true} message="Loading statement..." spinner="circles" />
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
                    <IonTitle>Customer Statement</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={handlePrint}>
                            <IonIcon icon={print} slot="icon-only" />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
                <IonToast
                    isOpen={showToast}
                    onDidDismiss={() => setShowToast(false)}
                    message={toastMessage}
                    duration={3000}
                />

                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle>STATEMENT</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <p><strong>Customer:</strong> {customer?.name || 'Unknown'}</p>
                        <p><strong>Code:</strong> {customer?.customer_code || '-'}</p>
                        <p><strong>Generated:</strong> {new Date().toLocaleDateString()}</p>
                    </IonCardContent>
                </IonCard>

                <IonList>
                    <IonItem color="light">
                        <IonLabel>
                            <strong>Date / Activity</strong>
                        </IonLabel>
                        <IonLabel slot="end" className="ion-text-right">
                            <strong>Amount / Balance</strong>
                        </IonLabel>
                    </IonItem>

                    {items.length === 0 ? (
                        <IonItem>
                            <IonLabel className="ion-text-center">
                                <p>No statement items found</p>
                            </IonLabel>
                        </IonItem>
                    ) : (
                        items.map((item) => (
                            <IonItem key={item.id}>
                                <IonLabel>
                                    <h3>{new Date(item.date).toLocaleDateString()}</h3>
                                    <p>{item.activity}</p>
                                    <p>Ref: {item.reference}</p>
                                </IonLabel>
                                <IonLabel slot="end" className="ion-text-right">
                                    <h3>${item.amount?.toLocaleString()}</h3>
                                    <p>Balance: ${item.balance?.toLocaleString()}</p>
                                </IonLabel>
                            </IonItem>
                        ))
                    )}
                </IonList>

                <IonCard>
                    <IonCardContent>
                        <div style={{ textAlign: 'right' }}>
                            <h2 style={{ margin: 0 }}>
                                <strong>Current Balance: </strong>
                                <span style={{ color: '#eb445a' }}>
                                    ${Number(customer?.current_balance || 0).toLocaleString()}
                                </span>
                            </h2>
                        </div>
                    </IonCardContent>
                </IonCard>
            </IonContent>
        </IonPage>
    );
};

export default CustomerStatement;
