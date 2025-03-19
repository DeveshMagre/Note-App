import express from 'express';
import { CreateNotes, Delete, GetNotes, UpdateNotes } from '../controllers/Notes.js';

const NotesRoutes = express.Router();

NotesRoutes.post('/create', CreateNotes);
NotesRoutes.put('/update/:id', UpdateNotes);
NotesRoutes.delete('/delete/:id', Delete);

NotesRoutes.get('/getnotes', GetNotes);

export default NotesRoutes;
