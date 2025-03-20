import express from 'express';
import { CreateNotes, DeleteNote, GetNotes, UpdateNotes } from '../controllers/Notes.js';

const NotesRoutes = express.Router();

NotesRoutes.post('/create', CreateNotes);
NotesRoutes.put('/update/:id', UpdateNotes);
NotesRoutes.delete('/delete/:id', DeleteNote); 

NotesRoutes.get('/getnotes', GetNotes);

export default NotesRoutes;
