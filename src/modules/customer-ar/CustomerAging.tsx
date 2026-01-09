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
    IonIcon,
    IonBadge
} from '@ionic/react';
import { print, refresh } from 'ionicons/icons';
import axios from 'axios';

import { requestID, baseUrl, config } from '../../common/utils';

interface AgingItem {
    customer_id: number;
    customer_name: string;
    customer_code: string;
    current: number;
    days_1_30: number;
    days_31_60: number;
    days_61_90: number;
    days_over_90: number;
    total: number;
}

interface AgingSummary {
    total_current: number;
    total_1_30: number;
    total_31_60: number;
    total_61_90: number;
    total_over_90: number;
    grand_total: number;
}

const CustomerAging: React.FC = () => {
    const [agingData, setAgingData] = useState<AgingItem[]>([]);
    const [summary, setSummary] = useState<AgingSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        fetchAgingReport();
    }, []);

    const fetchAgingReport = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("requestID", requestID());

            const response = await axios.post(
                baseUrl() + "geacloud_reports/aging",
                formData,
                config
            );

            console.log({ response });
            const { data } = response.data;

            if (data && Array.isArray(data)) {
                setAgingData(data);
                
                // Calculate summary totals
                const totals = data.reduce((acc: AgingSummary, item: AgingItem) => ({
                    total_current: acc.total_current + (item.current || 0),
                    total_1_30: acc.total_1_30 + (item.days_1_30 || 0),
                    total_31_60: acc.total_31_60 + (item.days_31_60 || 0),
                    total_61_90: acc.total_61_90 + (item.days_61_90 || 0),
                    total_over_90: acc.total_over_90 + (item.days_over_90 || 0),
                    grand_total: acc.grand_total + (item.total || 0)
                }), {
                    total_current: 0,
                    total_1_30: 0,
                    total_31_60: 0,
                    total_61_90: 0,
                    total_over_90: 0,
                    grand_total: 0
                });
                
                setSummary(totals);
            } else {
                setAgingData([]);
                setSummary(null);
            }

            setLoading(false);
        } catch (error) {
            console.error("Error fetching aging report:", error);
            setToastMessage("Failed to load aging report");
            setShowToast(true);
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const formatCurrency = (amount: number) => {
        return `$${(amount || 0).toLocaleString()}`;
    };

    if (loading) {
        return (
            <IonPage>
                <IonLoading isOpen={true} message="Loading aging report..." spinner="circles" />
            </IonPage>
        );
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="folder/customers" />
                    </IonButtons>
                    <IonTitle>Customer Aging Report</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={fetchAgingReport}>
                            <IonIcon icon={refresh} slot="icon-only" />
                        </IonButton>
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

                {/* Summary Card */}
                {summary && (
                    <IonCard>
                        <IonCardHeader>
                            <IonCardTitle>Aging Summary</IonCardTitle>
                        </IonCardHeader>
                        <IonCardContent>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'space-between' }}>
                                <div style={{ textAlign: 'center', flex: '1 1 80px' }}>
                                    <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>Current</p>
                                    <strong style={{ color: '#2dd36f' }}>{formatCurrency(summary.total_current)}</strong>
                                </div>
                                <div style={{ textAlign: 'center', flex: '1 1 80px' }}>
                                    <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>1-30 Days</p>
                                    <strong style={{ color: '#3880ff' }}>{formatCurrency(summary.total_1_30)}</strong>
                                </div>
                                <div style={{ textAlign: 'center', flex: '1 1 80px' }}>
                                    <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>31-60 Days</p>
                                    <strong style={{ color: '#ffc409' }}>{formatCurrency(summary.total_31_60)}</strong>
                                </div>
                                <div style={{ textAlign: 'center', flex: '1 1 80px' }}>
                                    <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>61-90 Days</p>
                                    <strong style={{ color: '#ff9500' }}>{formatCurrency(summary.total_61_90)}</strong>
                                </div>
                                <div style={{ textAlign: 'center', flex: '1 1 80px' }}>
                                    <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>90+ Days</p>
                                    <strong style={{ color: '#eb445a' }}>{formatCurrency(summary.total_over_90)}</strong>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right', marginTop: '15px', paddingTop: '10px', borderTop: '1px solid #ddd' }}>
                                <strong>Grand Total: </strong>
                                <span style={{ fontSize: '18px', color: '#eb445a' }}>{formatCurrency(summary.grand_total)}</span>
                            </div>
                        </IonCardContent>
                    </IonCard>
                )}

                {/* Aging List */}
                <IonList>
                    <IonItem color="light">
                        <IonLabel>
                            <strong>Customer</strong>
                        </IonLabel>
                        <IonLabel slot="end" className="ion-text-right">
                            <strong>Total Due</strong>
                        </IonLabel>
                    </IonItem>

                    {agingData.length === 0 ? (
                        <IonItem>
                            <IonLabel className="ion-text-center">
                                <p>No aging data found</p>
                            </IonLabel>
                        </IonItem>
                    ) : (
                        agingData.map((item) => (
                            <IonItem key={item.customer_id}>
                                <IonLabel>
                                    <h2>{item.customer_name}</h2>
                                    <p>Code: {item.customer_code}</p>
                                    <div style={{ display: 'flex', gap: '5px', marginTop: '5px', flexWrap: 'wrap' }}>
                                        {item.current > 0 && (
                                            <IonBadge color="success" style={{ fontSize: '10px' }}>
                                                Current: {formatCurrency(item.current)}
                                            </IonBadge>
                                        )}
                                        {item.days_1_30 > 0 && (
                                            <IonBadge color="primary" style={{ fontSize: '10px' }}>
                                                1-30: {formatCurrency(item.days_1_30)}
                                            </IonBadge>
                                        )}
                                        {item.days_31_60 > 0 && (
                                            <IonBadge color="warning" style={{ fontSize: '10px' }}>
                                                31-60: {formatCurrency(item.days_31_60)}
                                            </IonBadge>
                                        )}
                                        {item.days_61_90 > 0 && (
                                            <IonBadge color="tertiary" style={{ fontSize: '10px' }}>
                                                61-90: {formatCurrency(item.days_61_90)}
                                            </IonBadge>
                                        )}
                                        {item.days_over_90 > 0 && (
                                            <IonBadge color="danger" style={{ fontSize: '10px' }}>
                                                90+: {formatCurrency(item.days_over_90)}
                                            </IonBadge>
                                        )}
                                    </div>
                                </IonLabel>
                                <IonLabel slot="end" className="ion-text-right">
                                    <h2 style={{ color: '#eb445a', fontWeight: 'bold' }}>
                                        {formatCurrency(item.total)}
                                    </h2>
                                </IonLabel>
                            </IonItem>
                        ))
                    )}
                </IonList>

                <div style={{ padding: '16px', textAlign: 'center', color: '#666' }}>
                    Report generated: {new Date().toLocaleString()}
                </div>
            </IonContent>
        </IonPage>
    );
};

export default CustomerAging;
