import React, { useEffect, useState } from 'react';
import { Grid, Fab, Menu, MenuItem, Typography, ThemeProvider, CssBaseline, Box } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import CustomAppBar from '../components/CustomAppBar';
import NoteCard from '../components/NoteCard';
import NoteForm from '../components/NoteForm';
import DeleteConfirmation from '../components/DeleteConfirmation';
import { get, post, put, deleteNote } from "../services/ApiEndPoint";
import { useNavigate } from 'react-router-dom';
import io from "socket.io-client";
import toast from 'react-hot-toast';
import { createTheme } from '@mui/material/styles';

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
                tags: updateTags.split(',').map(tag => tag.trim()),
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
            note.tags?.some(tag => tag.toLowerCase().includes(searchLower))
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
            <CustomAppBar mode={mode} setMode={setMode} search={search} setSearch={setSearch} navigate={navigate} />

            <Grid container spacing={3} sx={{ p: 3 }}>
                {filteredNotes?.map((note) => (
                    <Grid item key={note._id} xs={12} sm={6} md={4}>
                        <NoteCard note={note} setModalId={setModalId} setAnchorEl={setAnchorEl} />
                    </Grid>
                ))}
            </Grid>

            <NoteForm
                open={addModalOpen}
                onClose={() => setAddModalOpen(false)}
                title={title}
                setTitle={setTitle}
                description={description}
                setDescription={setDescription}
                tags={tags}
                setTags={setTags}
                onSubmit={handleNoteSubmit}
                isEdit={false}
            />

            <NoteForm
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                title={updatetitle}
                setTitle={setUpdatetitle}
                description={updatedescription}
                setDescription={setUpdatedescription}
                tags={updateTags}
                setTags={setUpdateTags}
                onSubmit={handleUpdate}
                isEdit={true}
            />

            <DeleteConfirmation
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onDelete={handleDelete}
            />

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