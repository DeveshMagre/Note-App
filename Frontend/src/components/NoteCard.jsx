import React from 'react';
import { Card, CardContent, Typography, IconButton, Box, Checkbox } from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
import MailSender from './MailSender';

const NoteCard = ({ note, setModalId, setAnchorEl }) => {
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <Card>
            <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                        <Checkbox color="primary" />
                        <Typography
                            variant="h6"
                            sx={{ flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}
                        >
                            {note.title}
                        </Typography>
                        <IconButton onClick={(e) => { setModalId(note._id); setAnchorEl(e.currentTarget); }}>
                            <MoreVertIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{ display: 'flex', width: '100%', justifyContent: 'flex-end', mt: 1 }}>
                        <MailSender />
                    </Box>
                </Box>
                <Typography
                    variant="body1"
                    sx={{ mt: 2, lineHeight: 1.6, maxHeight: 100, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}
                >
                    {note.description}
                </Typography>
                {note.tags && note.tags.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            Tags: {note.tags.join(', ')}
                        </Typography>
                    </Box>
                )}
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {formatDate(note.updatedAt)}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default NoteCard;