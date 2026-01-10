import React, { useEffect, useState } from 'react';
import {
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
    IonBackButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonLoading, IonToast, IonList, IonItem, IonLabel, IonBadge, IonGrid, IonRow, IonCol,
    IonButton, IonIcon
} from '@ionic/react';
import { documentText, trash } from 'ionicons/icons';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { requestID, baseUrl, config } from '../../common/utils';

interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

interface Invoice {
    id: string;
    number: string;
    date: string;
    dueDate: string;
    status: string;
    subtotal: number;
    taxTotal: number;
    totalAmount: number;
    balance: number;
    items: InvoiceItem[];
}

const InvoiceDetail: React.FC = () => {
    const { invoiceId } = useParams<{ invoiceId: string }>();
    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [loading, setLoading] = useState(true);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        if (invoiceId) fetchInvoice();
    }, [invoiceId]);

    const fetchInvoice = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("requestID", requestID());
            formData.append("invoice_id", invoiceId);

            const response = await axios.post(baseUrl() + "geacloud_invoices", formData, config);
            const { data } = response.data;
            if (data) setInvoice(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching invoice:", error);
            setToastMessage("Failed to load invoice");
            setShowToast(true);
            setLoading(false);
        }
    };

    const handleCreditNote = async () => {
        const amount = window.prompt(`Issue credit note for Invoice #${invoice?.number}\n\nCredit Amount (max $${invoice?.balance}):`);
        if (!amount || parseFloat(amount) <= 0) return;

        if (parseFloat(amount) > (invoice?.balance || 0)) {
            setToastMessage("Credit amount cannot exceed invoice balance");
            setShowToast(true);
            return;
        }

        const reason = window.prompt('Reason for credit note:');
        if (!reason) return;

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("requestID", requestID());
            formData.append("invoice_id", invoiceId);
            formData.append("amount", amount);
            formData.append("reason", reason);

            await axios.post(baseUrl() + `geacloud_invoices/credit/${invoiceId}`, formData, config);
            
            setToastMessage("Credit note issued successfully");
            setShowToast(true);
            fetchInvoice(); // Refresh invoice data
        } catch (error) {
            console.error("Error issuing credit note:", error);
            setToastMessage("Failed to issue credit note");
            setShowToast(true);
            setLoading(false);
        }
    };

    const handleWriteOff = async () => {
        if (!window.confirm(`Are you sure you want to write off Invoice #${invoice?.number}?\n\nWrite-off Amount: $${invoice?.balance}\n\nThis action cannot be undone.`)) {
            return;
        }

        const reason = window.prompt('Reason for write-off:');
        if (!reason) return;

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("requestID", requestID());
            formData.append("invoice_id", invoiceId);
            formData.append("reason", reason);

            await axios.post(baseUrl() + `geacloud_invoices/writeoff/${invoiceId}`, formData, config);
            
            setToastMessage("Invoice written off successfully");
            setShowToast(true);
            fetchInvoice(); // Refresh invoice data
        } catch (error) {
            console.error("Error writing off invoice:", error);
            setToastMessage("Failed to write off invoice");
            setShowToast(true);
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'paid': return 'success';
            case 'overdue': return 'danger';
            default: return 'medium';
        }
    };

    if (loading) return <IonPage><IonLoading isOpen={true} message="Loading..." /></IonPage>;
    if (!invoice) return <IonPage><IonContent><p>Invoice not found</p></IonContent></IonPage>;

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start"><IonBackButton defaultHref="/invoices" /></IonButtons>
                    <IonTitle>Invoice #{invoice.number}</IonTitle>
                    {invoice.balance > 0 && invoice.status !== 'paid' && (
                        <IonButtons slot="end">
                            <IonButton onClick={handleCreditNote}>
                                <IonIcon icon={documentText} slot="start" />
                                Credit Note
                            </IonButton>
                            <IonButton color="danger" onClick={handleWriteOff}>
                                <IonIcon icon={trash} slot="start" />
                                Write Off
                            </IonButton>
                        </IonButtons>
                    )}
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonToast isOpen={showToast} onDidDismiss={() => setShowToast(false)} message={toastMessage} duration={3000} />
                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle>INVOICE <IonBadge color={getStatusColor(invoice.status)}>{invoice.status}</IonBadge></IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <p><strong>Date:</strong> {new Date(invoice.date).toLocaleDateString()}</p>
                        <p><strong>Due:</strong> {new Date(invoice.dueDate).toLocaleDateString()}</p>
                    </IonCardContent>
                </IonCard>
                <IonCard>
                    <IonCardHeader><IonCardTitle>Items</IonCardTitle></IonCardHeader>
                    <IonCardContent>
                        <IonList>
                            {invoice.items?.map((item, i) => (
                                <IonItem key={i}>
                                    <IonLabel><p>{item.description}</p></IonLabel>
                                    <IonLabel slot="end" className="ion-text-right">
                                        <p>{item.quantity} x ${item.unitPrice}</p>
                                        <h3>${item.total}</h3>
                                    </IonLabel>
                                </IonItem>
                            ))}
                        </IonList>
                    </IonCardContent>
                </IonCard>
                <IonCard>
                    <IonCardContent>
                        <IonGrid>
                            <IonRow><IonCol>Subtotal:</IonCol><IonCol className="ion-text-right">${invoice.subtotal}</IonCol></IonRow>
                            <IonRow><IonCol>Tax:</IonCol><IonCol className="ion-text-right">${invoice.taxTotal}</IonCol></IonRow>
                            <IonRow><IonCol><strong>Total:</strong></IonCol><IonCol className="ion-text-right"><strong>${invoice.totalAmount}</strong></IonCol></IonRow>
                            <IonRow><IonCol><strong style={{color:'#eb445a'}}>Balance:</strong></IonCol><IonCol className="ion-text-right"><strong style={{color:'#eb445a'}}>${invoice.balance}</strong></IonCol></IonRow>
                        </IonGrid>
                    </IonCardContent>
                </IonCard>
            </IonContent>
        </IonPage>
    );
};

export default InvoiceDetail;
