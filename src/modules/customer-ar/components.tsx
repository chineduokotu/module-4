import React from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    TablePagination, Box, Typography, Skeleton, Card, CardContent
} from '@mui/material';

// --- StatusBadge ---
export const StatusBadge: React.FC<{ status: string | number }> = ({ status }) => {
    let statusStr = String(status);
    if (typeof status === 'number') {
        statusStr = status === 1 ? 'Active' : 'Inactive';
    }
    
    // Simple color mapping with explicit color values
    const lower = statusStr.toLowerCase();
    let bgColor = 'grey.300';
    let textColor = 'grey.800';
    
    if (['active', 'paid', 'sent'].includes(lower)) {
        bgColor = 'success.light';
        textColor = 'success.dark';
    } else if (['inactive', 'draft', 'pending'].includes(lower)) {
        bgColor = 'warning.light';
        textColor = 'warning.dark';
    } else if (['blocked', 'overdue', 'void'].includes(lower)) {
        bgColor = 'error.light';
        textColor = 'error.dark';
    }

    return (
        <Box
            sx={{
                backgroundColor: bgColor,
                color: textColor,
                borderRadius: 1, px: 1, py: 0.5, display: 'inline-block', fontSize: '0.75rem', fontWeight: 'bold'
            }}
        >
            {statusStr}
        </Box>
    );
};

// --- DataTable (Generic) ---
export interface Column<T> {
    id: keyof T | string;
    label: string;
    minWidth?: number;
    align?: 'right' | 'left' | 'center';
    format?: (value: any, row: T) => React.ReactNode;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    rows: T[];
    pagination?: boolean;
    count?: number;
    page?: number;
    rowsPerPage?: number;
    onPageChange?: (page: number) => void;
    onRowsPerPageChange?: (rowsPerPage: number) => void;
    onRowClick?: (row: T) => void;
}

export function DataTable<T extends { id: string | number }>({
    columns, rows, pagination, count = 0, page = 0, rowsPerPage = 10, onRowClick
}: DataTableProps<T>) {
    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell key={String(column.id)} align={column.align} style={{ minWidth: column.minWidth }}>
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} align="center">
                                    <Typography variant="body2" sx={{ py: 2 }}>No data available</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            rows.map((row) => (
                                <TableRow hover role="checkbox" tabIndex={-1} key={row.id} onClick={() => onRowClick && onRowClick(row)} sx={{ cursor: onRowClick ? 'pointer' : 'default' }}>
                                    {columns.map((column) => {
                                        const value = (row as any)[column.id];
                                        return (
                                            <TableCell key={String(column.id)} align={column.align}>
                                                {column.format ? column.format(value, row) : value}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            {pagination && (
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={count}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={() => { }} 
                    onRowsPerPageChange={() => { }} 
                />
            )}
        </Paper>
    );
}

// --- LoadingSkeleton ---
export const LoadingSkeleton: React.FC = () => (
    <Box sx={{ width: '100%' }}>
        <Skeleton variant="rectangular" width="100%" height={118} sx={{ mb: 2 }} />
        <Skeleton width="60%" />
        <Skeleton width="40%" />
        <Skeleton variant="rectangular" width="100%" height={60} sx={{ mt: 2 }} />
        <Skeleton variant="rectangular" width="100%" height={60} sx={{ mt: 1 }} />
    </Box>
);

// --- SummaryCard ---
export const SummaryCard: React.FC<{ title: string; value: string | number; subtitle?: string; color?: string }> = ({ title, value, subtitle, color }) => (
    <Card sx={{ minWidth: 200, borderLeft: color ? `4px solid ${color}` : undefined }}>
        <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>{title}</Typography>
            <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>{value}</Typography>
            {subtitle && <Typography sx={{ mb: 1.5 }} color="text.secondary">{subtitle}</Typography>}
        </CardContent>
    </Card>
);
