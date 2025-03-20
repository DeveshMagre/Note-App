import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

const NoteForm = ({ open, onClose, title, setTitle, description, setDescription, tags, setTags, onSubmit, isEdit }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{isEdit ? 'Edit Note' : 'Create New Note'}</DialogTitle>
            <DialogContent sx={{ minWidth: 400 }}>
                <TextField
                    autoFocus
                    fullWidth
                    margin="normal"
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Description"
                    multiline
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter your note description..."
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Enter tags, separated by commas..."
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={onSubmit} variant="contained">{isEdit ? 'Save' : 'Create'}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default NoteForm;