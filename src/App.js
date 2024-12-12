import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';  // For navigation

const PaymentButton = () => {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        to: '',
        from: '',
        amount: '',
        description: ''
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();  // Hook for navigation (for redirecting on Unauthorized)

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setFormData({
            to: '',
            from: '',
            amount: '',
            description: ''
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Validate email format using regular expression
    const isEmailValid = /\S+@\S+\.\S+/.test(formData.to);

    // Check if form submission is enabled
    const isSubmitDisabled = !formData.to || !formData.from || !formData.amount || !isEmailValid;

    // Mock API function simulating different responses
    const mockApiCall = () => {
        const mockResponses = [
            { status: 200, message: 'Success' },
            { status: 400, message: 'Bad Request' },
            { status: 401, message: 'Unauthorized' },
            { status: 500, message: 'Server Error' }
        ];

        // Randomly choose one of the mock responses
        const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (randomResponse.status === 200) {
                    resolve(randomResponse); // Simulate successful response
                } else {
                    reject(randomResponse); // Simulate an error response
                }
            }, 1000); // Simulate a 1-second delay for the mock API call
        });
    };

    const handleSubmit = async () => {
        try {
            const response = await mockApiCall(); // Call the mock API

            if (response.status === 200) {
                setSuccess(true);  // Show success dialog
                setError(null);  // Clear any previous errors
                handleClose();
            }
        } catch (error) {
            setSuccess(false);
            setError(error.message);  // Set error message for failure scenarios

            if (error.status === 401) {
                // Redirect to login page on Unauthorized
                navigate('/login');
            } else if (error.status === 500) {
                setError('Server Error: Please try again later');
            }
        }
    };

    return (
        <>
            <Button 
                variant="contained" 
                color="primary" 
                onClick={handleClickOpen}
            >
                Pay Now
            </Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Payment Details</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="To"
                        type="text" 
                        name="to"
                        fullWidth
                        value={formData.to}
                        placeholder="Enter recipient's email"
                        onChange={handleChange}
                        required
                        error={!formData.to || !isEmailValid}
                        helperText={!formData.to || !isEmailValid ? 'Enter a valid email address' : ''}
                        style={{ marginBottom: '16px' }}
                    />
                    <TextField
                        margin="dense"
                        label="From"
                        name="from"
                        select
                        fullWidth
                        value={formData.from}
                        onChange={handleChange}
                        required
                        error={!formData.from}
                        helperText={!formData.from ? 'This field is required' : ''}
                        style={{ marginBottom: '16px' }}
                    >
                        <MenuItem value="BTC">BTC</MenuItem>
                        <MenuItem value="ETH">ETH</MenuItem>
                    </TextField>
                    <TextField
                        margin="dense"
                        label="Amount"
                        type="number"
                        name="amount"
                        fullWidth
                        value={formData.amount}
                        placeholder="Enter amount"
                        onChange={handleChange}
                        required
                        error={!formData.amount}
                        helperText={!formData.amount ? 'This field is required' : ''}
                        style={{ marginBottom: '16px' }}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        type="text"
                        name="description"
                        fullWidth
                        value={formData.description}
                        placeholder="Optional description"
                        onChange={handleChange}
                        multiline
                        rows={3}
                        style={{ marginBottom: '16px' }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">Cancel</Button>
                    <Button onClick={handleSubmit} color="primary" disabled={isSubmitDisabled}>Submit</Button>
                </DialogActions>
            </Dialog>

            {/* Success Dialog */}
            <Dialog open={success}>
                <DialogTitle>Success</DialogTitle>
                <DialogContent>
                    <p>Payment was successful!</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSuccess(false)} color="primary">Close</Button>
                </DialogActions>
            </Dialog>

            {/* Error Dialog */}
            <Dialog open={error}>
                <DialogTitle>Error</DialogTitle>
                <DialogContent>
                    <p>{error}</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setError(null)} color="primary">Close</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default PaymentButton;


