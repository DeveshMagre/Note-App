import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

const DeleteConfirmation = ({ open, onClose, onDelete }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Delete Note</DialogTitle>
            <DialogContent>
                <Typography>Are you sure you want to delete this note?</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={onDelete} color="error" variant="contained">Delete</Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteConfirmation;