import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { get, post, put, deleteNote } from "../services/ApiEndPoint";
import { useNavigate } from 'react-router-dom';
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
    CssBaseline
} from '@mui/material';
import { Add as AddIcon, MoreVert as MoreVertIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { Brightness4 as Brightness4Icon, Brightness7 as Brightness7Icon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

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
    const [updatetitle, setUpdatetitle] = useState('');
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

    const theme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    mode: mode,
                },
            }),
        [mode],
    );

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleNoteSubmit = async () => {
        if (!title.trim()) return;
        try {
            const request = await post('/notes/create', { title });
            const response = request.data;
            if (response.success) {
                toast.success(response.message);
                setRefresh(!refresh);
                setAddModalOpen(false);
                setTitle('');
            }
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message);
            }
            console.error(error);
        }
    };

    const handleUpdate = async () => {
        if (!updatetitle.trim()) return;
        if (!modalId) {
            console.error("modalId is not set!");
            toast.error("Error: Note ID is missing.");
            return;
        }

        try {
            const request = await put(`/notes/update/${modalId}`, { title: updatetitle });
            const response = request.data;
            if (response.success) {
                toast.success(response.message);
                setRefresh(!refresh);
                setEditModalOpen(false);
            }
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message);
            }
            console.error("Update error:", error);
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
            }
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message);
            }
            console.error(error);
        }
    };

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const request = await get('/notes/getnotes');
                const response = request.data;
                setNotes(response.Notes);
                setFilteredNotes(response.Notes);
            } catch (error) {
                console.error(error);
            }
        };
        fetchNotes();
    }, [refresh]);

    useEffect(() => {
        setFilteredNotes(notes.filter(note => note.title.toLowerCase().includes(search.toLowerCase())));
    }, [search, notes]);

    const handleMenuOpen = (event, noteId) => {
        setAnchorEl(event.currentTarget);
        setModalId(noteId);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

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
                        size="small"
                        placeholder="Search notes..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={(theme) => ({
                            backgroundColor: theme.palette.background.paper,
                            borderRadius: 1,
                            mr: 2,
                            '& .MuiOutlinedInput-root': {
                                color: theme.palette.text.primary,
                            },
                            '& .MuiInputLabel-root': {
                                color: theme.palette.text.secondary,
                            },
                        })}
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

            <Dialog
                open={addModalOpen}
                onClose={() => setAddModalOpen(false)}
                maxWidth="sm"
                fullWidth
                sx={{
                    '& .MuiDialog-paper': {
                        backgroundColor: 'background.paper',
                        color: 'text.primary',
                        borderRadius: 3,
                        p: 2,
                    }
                }}
            >
                <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.4rem" }}>
                    Write Notes
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        fullWidth
                        variant="outlined"
                        label="Note"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        sx={{ mt: 1 }}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setAddModalOpen(false)} color="error">
                        Cancel
                    </Button>
                    <Button onClick={handleNoteSubmit} variant="contained" color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                sx={{
                    '& .MuiDialog-paper': {
                        backgroundColor: 'background.paper',
                        color: 'text.primary',
                    }
                }}
            >
                <DialogTitle>Update Notes</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        fullWidth
                        variant="standard"
                        value={updatetitle}
                        onChange={(e) => setUpdatetitle(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
                    <Button onClick={handleUpdate}>Update</Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                sx={{
                    '& .MuiDialog-paper': {
                        backgroundColor: 'background.paper',
                        color: 'text.primary',
                    }
                }}
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this note?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
                    <Button onClick={handleDelete} color="error">Delete</Button>
                </DialogActions>
            </Dialog>

            <Grid container spacing={3} sx={{ p: 3 }}>
                {filteredNotes.map((note) => (
                    <Grid item key={note._id} xs={12} sm={6} md={4}>
                        <Card sx={{
                            backgroundColor: 'background.paper',
                            color: 'text.primary',
                            height: '100%'
                        }}>
                            <CardContent>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            wordWrap: 'break-word',
                                            flex: 1,
                                            minWidth: 0
                                        }}
                                    >
                                        {note.title}
                                    </Typography>
                                    <IconButton onClick={(e) => handleMenuOpen(e, note._id)}>
                                        <MoreVertIcon />
                                    </IconButton>
                                </div>
                                <Typography variant="body2" color="text.secondary">
                                    {formatDate(note.updatedAt)}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                sx={{
                    '& .MuiPaper-root': {
                        backgroundColor: 'background.paper',
                        color: 'text.primary',
                    }
                }}
            >
                <MenuItem onClick={() => {
                    setUpdatetitle(notes.find(n => n._id === modalId)?.title || '');
                    setEditModalOpen(true);
                    handleMenuClose();
                }}>
                    Edit
                </MenuItem>
                <MenuItem onClick={() => {
                    setDeleteModalOpen(true);
                    handleMenuClose();
                }}>
                    Delete
                </MenuItem>
            </Menu>

            <StyledFab color="primary" onClick={() => setAddModalOpen(true)}>
                <AddIcon />
            </StyledFab>

            {filteredNotes.length === 0 && (
                <Typography variant="h4" align="center" sx={{ mt: 5, color: 'text.primary' }}>
                    No Notes Found
                </Typography>
            )}
        </ThemeProvider>
    );
}