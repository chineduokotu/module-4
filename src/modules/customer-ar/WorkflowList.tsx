import React, { useState, useEffect } from 'react';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonButton,
    IonList,
    IonItem,
    IonLabel,
    IonBadge,
    IonLoading,
    IonToast,
    IonRefresher,
    IonRefresherContent,
    IonSegment,
    IonSegmentButton,
    IonCard,
    IonCardContent,
    IonIcon
} from '@ionic/react';
import { checkmark, close, refresh } from 'ionicons/icons';
import axios from 'axios';

import { requestID, baseUrl, config } from '../../common/utils';

interface WorkflowRequest {
    id: string;
    type: string;
    customer_id: number;
    customer_name: string;
    amount: number;
    reason: string;
    status: string;
    created_by: string;
    created_at: string;
    invoice_id?: string;
    invoice_number?: string;
}

const WorkflowList: React.FC = () => {
    const [requests, setRequests] = useState<WorkflowRequest[]>([]);
    const [filteredRequests, setFilteredRequests] = useState<WorkflowRequest[]>([]);
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('pending');

    useEffect(() => {
        fetchRequests();
    }, []);

    useEffect(() => {
        if (statusFilter === 'all') {
            setFilteredRequests(requests);
        } else {
            setFilteredRequests(requests.filter(req => req.status === statusFilter));
        }
    }, [statusFilter, requests]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("requestID", requestID());

            const response = await axios.post(
                baseUrl() + "geacloud_workflows/pending",
                formData,
                config
            );

            console.log({ response });
            const { data } = response.data;
            
            if (data && Array.isArray(data)) {
                setRequests(data);
                setFilteredRequests(data.filter(req => req.status === 'pending'));
            } else {
                setRequests([]);
                setFilteredRequests([]);
            }

            setLoading(false);
        } catch (error) {
            console.error("Error fetching workflow requests:", error);
            setToastMessage("Failed to load requests");
            setShowToast(true);
            setLoading(false);
        }
    };

    const handleApprove = async (requestId: string) => {
        if (!window.confirm('Are you sure you want to approve this request?')) {
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("requestID", requestID());
            formData.append("request_id", requestId);
            formData.append("action", "approve");

            await axios.post(
                baseUrl() + `geacloud_workflows/action/${requestId}`,
                formData,
                config
            );

            setToastMessage("Request approved successfully");
            setShowToast(true);
            fetchRequests();
        } catch (error) {
            console.error("Error approving request:", error);
            setToastMessage("Failed to approve request");
            setShowToast(true);
            setLoading(false);
        }
    };

    const handleReject = async (requestId: string) => {
        const reason = window.prompt('Please provide a reason for rejection:');
        if (!reason) {
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("requestID", requestID());
            formData.append("request_id", requestId);
            formData.append("action", "reject");
            formData.append("rejection_reason", reason);

            await axios.post(
                baseUrl() + `geacloud_workflows/action/${requestId}`,
                formData,
                config
            );

            setToastMessage("Request rejected successfully");
            setShowToast(true);
            fetchRequests();
        } catch (error) {
            console.error("Error rejecting request:", error);
            setToastMessage("Failed to reject request");
            setShowToast(true);
            setLoading(false);
        }
    };

    const handleRefresh = async (event: CustomEvent) => {
        await fetchRequests();
        event.detail.complete();
    };

    const getTypeColor = (type: string) => {
        switch (type?.toLowerCase()) {
            case 'refund': return 'danger';
            case 'discount': return 'warning';
            default: return 'primary';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'approved': return 'success';
            case 'rejected': return 'danger';
            case 'pending': return 'warning';
            default: return 'medium';
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/customers" />
                    </IonButtons>
                    <IonTitle>Workflow Approvals</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={fetchRequests}>
                            <IonIcon icon={refresh} slot="icon-only" />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
                <IonToolbar>
                    <IonSegment value={statusFilter} onIonChange={(e) => setStatusFilter(e.detail.value as string)}>
                        <IonSegmentButton value="pending">
                            <IonLabel>Pending</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="approved">
                            <IonLabel>Approved</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="rejected">
                            <IonLabel>Rejected</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="all">
                            <IonLabel>All</IonLabel>
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

                {filteredRequests.length === 0 && !loading ? (
                    <IonCard>
                        <IonCardContent className="ion-text-center">
                            <p>No workflow requests found</p>
                        </IonCardContent>
                    </IonCard>
                ) : (
                    <IonList>
                        {filteredRequests.map((request) => (
                            <IonItem key={request.id}>
                                <IonLabel>
                                    <h2>
                                        <IonBadge color={getTypeColor(request.type)}>
                                            {request.type.toUpperCase()}
                                        </IonBadge>
                                        {' '}
                                        ${request.amount.toLocaleString()}
                                    </h2>
                                    <p><strong>Customer:</strong> {request.customer_name}</p>
                                    {request.invoice_number && (
                                        <p><strong>Invoice:</strong> #{request.invoice_number}</p>
                                    )}
                                    <p><strong>Reason:</strong> {request.reason}</p>
                                    <p><strong>Created by:</strong> {request.created_by} on {new Date(request.created_at).toLocaleDateString()}</p>
                                </IonLabel>
                                <IonLabel slot="end" className="ion-text-right">
                                    <IonBadge color={getStatusColor(request.status)}>
                                        {request.status}
                                    </IonBadge>
                                    {request.status === 'pending' && (
                                        <div style={{ marginTop: '10px', display: 'flex', gap: '5px' }}>
                                            <IonButton
                                                size="small"
                                                color="success"
                                                onClick={() => handleApprove(request.id)}
                                            >
                                                <IonIcon icon={checkmark} slot="start" />
                                                Approve
                                            </IonButton>
                                            <IonButton
                                                size="small"
                                                color="danger"
                                                onClick={() => handleReject(request.id)}
                                            >
                                                <IonIcon icon={close} slot="start" />
                                                Reject
                                            </IonButton>
                                        </div>
                                    )}
                                </IonLabel>
                            </IonItem>
                        ))}
                    </IonList>
                )}

                {filteredRequests.length > 0 && (
                    <div style={{ padding: '16px', textAlign: 'center', color: '#666' }}>
                        Showing {filteredRequests.length} of {requests.length} requests
                    </div>
                )}
            </IonContent>
        </IonPage>
    );
};

export default WorkflowList;
