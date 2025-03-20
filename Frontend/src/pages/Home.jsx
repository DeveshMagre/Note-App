import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { get, post, put, deleteNote } from "../services/ApiEndPoint";
import { useNavigate } from 'react-router-dom';
import MailSender from '../components/MailSender';
import io from "socket.io-client";
import {
    AppBar,
    Toolbar,
    Typography,
    TextField,
    Button,
    Grid,
    Card,
    CardContent,
    IconButton,
    Menu,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Fab,
    createTheme,
    ThemeProvider,
    CssBaseline,
    Checkbox,
    Box
} from '@mui/material';
import { Add as AddIcon, MoreVert as MoreVertIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { Brightness4 as Brightness4Icon, Brightness7 as Brightness7Icon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const socket = io("http://localhost:5000");

const StyledFab = styled(Fab)({
    position: 'fixed',
    bottom: 32,
    right: 32,
});

export default function Home() {
    const navigate = useNavigate();
    const [notes, setNotes] = useState([]);
    const [filteredNotes, setFilteredNotes] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');
    const [updatetitle, setUpdatetitle] = useState('');
    const [updatedescription, setUpdatedescription] = useState('');
    const [updateTags, setUpdateTags] = useState('');
    const [modalId, setModalId] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const [search, setSearch] = useState('');
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [mode, setMode] = useState(() => {
        const savedMode = localStorage.getItem('themeMode');
        return savedMode || 'light';
    });

    useEffect(() => {
        localStorage.setItem('themeMode', mode);
    }, [mode]);

    const theme = createTheme({
        palette: {
            mode: mode,
        },
    });

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleNoteSubmit = async () => {
        if (!title.trim()) return;
        try {
            const request = await post('/notes/create', {
                title,
                description: description.trim(),
                tags: tags.split(',').map(tag => tag.trim()), 
            });
            const response = request.data;
            if (response.success) {
                toast.success(response.message);
                setRefresh(!refresh);
                setAddModalOpen(false);
                setTitle('');
                setDescription('');
                setTags('');
                socket.emit('noteCreated', response.notes);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error creating note');
        }
    };

    const handleUpdate = async () => {
        if (!updatetitle.trim()) return;
        try {
            const request = await put(`/notes/update/${modalId}`, {
                title: updatetitle,
                description: updatedescription.trim(),
                tags: updateTags.split(',').map(tag => tag.trim()), // Split tags by comma and trim whitespace
            });
            const response = request.data;
            if (response.success) {
                toast.success(response.message);
                setRefresh(!refresh);
                setEditModalOpen(false);
                socket.emit('noteUpdated', response.notes);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating note');
        }
    };

    const handleDelete = async () => {
        try {
            const request = await deleteNote(`/notes/delete/${modalId}`);
            const response = request.data;
            if (response.success) {
                toast.success(response.message);
                setRefresh(!refresh);
                setDeleteModalOpen(false);
                socket.emit('noteDeleted', modalId);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error deleting note');
        }
    };

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const request = await get('/notes/getnotes');
                const response = request.data;
                setNotes(response.notes);
            } catch (error) {
                toast.error(error.response?.data?.message || 'Error fetching notes');
            }
        };
        fetchNotes();
    }, [refresh]);

    useEffect(() => {
        const searchLower = search.toLowerCase();
        const filtered = notes?.filter(note =>
            note.title.toLowerCase().includes(searchLower) ||
            note.description?.toLowerCase().includes(searchLower) ||
            note.tags?.some(tag => tag.toLowerCase().includes(searchLower)) // Search by tags
        );
        setFilteredNotes(filtered);
    }, [search, notes]);

    useEffect(() => {
        socket.on('noteCreated', (newNote) => {
            setNotes((prevNotes) => [...prevNotes, newNote]);
        });

        socket.on('noteUpdated', (updatedNote) => {
            setNotes((prevNotes) =>
                prevNotes.map((note) =>
                    note._id === updatedNote._id ? updatedNote : note
                )
            );
        });

        socket.on('noteDeleted', (deletedNoteId) => {
            setNotes((prevNotes) =>
                prevNotes.filter((note) => note._id !== deletedNoteId)
            );
        });

        return () => {
            socket.off('noteCreated');
            socket.off('noteUpdated');
            socket.off('noteDeleted');
        };
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar position="static" color="primary">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Notes App
                    </Typography>

                    <TextField
                        variant="outlined"
                        style={{
                            backgroundColor: "white",
                            borderRadius: "25px",
                            color: "black"
                        }}
                        size="small"
                        placeholder="Search notes..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{ mr: 2, width: 300 }}
                    />
                    <IconButton
                        color="inherit"
                        onClick={() => setMode(prev => prev === 'light' ? 'dark' : 'light')}
                        sx={{ mr: 2 }}
                    >
                        {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>

                    <Button
                        color="inherit"
                        endIcon={<LogoutIcon />}
                        onClick={() => navigate('/login')}
                    >
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>

            <Grid container spacing={3} sx={{ p: 3 }}>
                {filteredNotes?.map((note) => (
                    <Grid item key={note._id} xs={12} sm={6} md={4}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                    <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                                        <Checkbox color="primary" />
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                flexGrow: 1,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            }}
                                        >
                                            {note.title}
                                        </Typography>
                                        <IconButton
                                            onClick={(e) => {
                                                setModalId(note._id);
                                                setAnchorEl(e.currentTarget);
                                            }}
                                        >
                                            <MoreVertIcon />
                                        </IconButton>
                                    </Box>
                                    <Box sx={{ display: 'flex', width: '100%', justifyContent: 'flex-end', mt: 1 }}>
                                        <MailSender />
                                    </Box>
                                </Box>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        mt: 2,
                                        lineHeight: 1.6,
                                        maxHeight: 100,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: 'vertical',
                                    }}
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
                    </Grid>
                ))}
            </Grid>

            <Dialog open={addModalOpen} onClose={() => setAddModalOpen(false)}>
                <DialogTitle>Create New Note</DialogTitle>
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
                    <Button onClick={() => setAddModalOpen(false)}>Cancel</Button>
                    <Button onClick={handleNoteSubmit} variant="contained">Create</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)}>
                <DialogTitle>Edit Note</DialogTitle>
                <DialogContent sx={{ minWidth: 400 }}>
                    <TextField
                        autoFocus
                        fullWidth
                        margin="normal"
                        label="Title"
                        value={updatetitle}
                        onChange={(e) => setUpdatetitle(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Description"
                        multiline
                        rows={4}
                        value={updatedescription}
                        onChange={(e) => setUpdatedescription(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Tags"
                        value={updateTags}
                        onChange={(e) => setUpdateTags(e.target.value)}
                        placeholder="Enter tags, separated by commas..."
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
                    <Button onClick={handleUpdate} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
                <DialogTitle>Delete Note</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this note?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
                    <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
                </DialogActions>
            </Dialog>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
            >
                <MenuItem onClick={() => {
                    const note = notes.find(n => n._id === modalId);
                    setUpdatetitle(note.title);
                    setUpdatedescription(note.description || '');
                    setUpdateTags(note.tags?.join(', ') || '');
                    setEditModalOpen(true);
                    setAnchorEl(null);
                }}>
                    Edit
                </MenuItem>
                <MenuItem onClick={() => {
                    setDeleteModalOpen(true);
                    setAnchorEl(null);
                }}>
                    Delete
                </MenuItem>
            </Menu>

            <StyledFab color="primary" onClick={() => setAddModalOpen(true)}>
                <AddIcon />
            </StyledFab>

            {filteredNotes?.length === 0 && (
                <Typography variant="h6" align="center" sx={{ mt: 5, color: 'text.secondary' }}>
                    No notes found
                </Typography>
            )}
        </ThemeProvider>
    );
}