import NotesModel from "../models/Notes.js";

const CreateNotes = async (req, res) => {
    try {
        const userId = req.userId;
        const { title } = req.body;

        if (!title) {
            return res.status(400).json({ success: false, message: "Title is required" });
        }

        const CreateNotes = new NotesModel({ title, userId });
        await CreateNotes.save();

        res.status(201).json({ success: true, message: "Note created successfully", Notes: CreateNotes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const UpdateNotes = async (req, res) => {
    try {
        const NotesId = req.params.id;
        const { title } = req.body;

        const updatedNote = await NotesModel.findByIdAndUpdate(
            { _id: NotesId },
            { title },
            { new: true }
        );

        if (!updatedNote) {
            return res.status(404).json({ success: false, message: "Note not found" });
        }

        res.status(200).json({ success: true, message: "Note updated successfully", updatedNote });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const Delete = async (req, res) => {
    try {
        const NotesId = req.params.id;

        const deletedNote = await NotesModel.findByIdAndDelete(NotesId);
        if (!deletedNote) {
            return res.status(404).json({ success: false, message: "Note not found" });
        }

        res.status(200).json({ success: true, message: "Note deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const GetNotes = async (req, res) => {
    try {
        const userId = req.userId;
        const Notes = await NotesModel.find({ userId });

        res.status(200).json({ success: true, Notes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export { CreateNotes, UpdateNotes, Delete, GetNotes };
