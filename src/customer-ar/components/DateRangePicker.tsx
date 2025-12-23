import React from 'react';
import { Box, TextField, Stack } from '@mui/material';

interface DateRangePickerProps {
    startDate: string;
    endDate: string;
    onStartDateChange: (date: string) => void;
    onEndDateChange: (date: string) => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
    startDate, endDate, onStartDateChange, onEndDateChange
}) => {
    return (
        <Stack direction="row" spacing={2} alignItems="center">
            <TextField
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
            />
            <Box>-</Box>
            <TextField
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
            />
        </Stack>
    );
};
