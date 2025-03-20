import NotesModel from "../models/Notes.js";
import io from "../index.js"; 

const CreateNotes = async (req, res) => {
    try {
        const userId = req.userId;
        const { title, description , tags} = req.body;

        if (!title) {
            return res.status(400).json({ success: false, message: "Title is required" });
        }

        const newNote = new NotesModel({ title, description, tags, userId });
        await newNote.save();

        io.emit("refreshNotes"); 

        res.status(201).json({ success: true, message: "Note created successfully", note: newNote });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const UpdateNotes = async (req, res) => {
    try {
        const noteId = req.params.id;
        const { title, description, tags } = req.body;

        const updatedNote = await NotesModel.findByIdAndUpdate(
            noteId,
            { title, description, tags },
            { new: true }
        );

        if (!updatedNote) {
            return res.status(404).json({ success: false, message: "Note not found" });
        }

        io.emit("refreshNotes"); 

        res.status(200).json({ success: true, message: "Note updated successfully", note: updatedNote });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const DeleteNote = async (req, res) => {
    try {
        const noteId = req.params.id;

        const deletedNote = await NotesModel.findByIdAndDelete(noteId);
        if (!deletedNote) {
            return res.status(404).json({ success: false, message: "Note not found" });
        }

        io.emit("refreshNotes"); 

        res.status(200).json({ success: true, message: "Note deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const GetNotes = async (req, res) => {
    try {
        const userId = req.userId;
        const notes = await NotesModel.find({ userId });

        res.status(200).json({ success: true, notes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export { CreateNotes, UpdateNotes, DeleteNote, GetNotes };
